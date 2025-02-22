import { Request, Response } from "express";
import Election, { IElection } from "../models/election.model";
import User from "../models/user.model";
import mongoose from "mongoose";

export const createElection = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, positions } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
      return
    }

    if (start < new Date()) {
      res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
      return
    }

    const newElection = new Election({
      title,
      description,
      startDate: start,
      endDate: end,
      positions,
      candidates: [],
      voters: [],
      results: [],
    });

    await newElection.save();

    res.status(201).json({
      success: true,
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating election",
      error: error.message,
    });
  }
};

export const addCandidate = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    const { userId, position, manifesto } = req.body;

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    // Check if election has started
    if (new Date() >= election.startDate) {
      res.status(400).json({
        success: false,
        message: "Cannot add candidates after election has started",
      });
      return
    }

    // Check if position is valid
    if (!election.positions.includes(position)) {
      res.status(400).json({
        success: false,
        message: "Invalid position",
      });
      return
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return
    }

    // Check if user is already a candidate for any position in this election
    const isAlreadyCandidate = election.candidates.some(
      (candidate) => candidate.userId.toString() === userId
    );
    if (isAlreadyCandidate) {
      res.status(400).json({
        success: false,
        message: "User is already a candidate in this election",
      });
      return
    }

    // Add candidate
    election.candidates.push({
      userId: new mongoose.Types.ObjectId(userId),
      name: `${user.firstName} ${user.lastName}`,
      position,
      manifesto,
      votes: 0,
    });

    await election.save();

    res.status(200).json({
      success: true,
      message: "Candidate added successfully",
      election,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error adding candidate",
      error: error.message,
    });
  }
};

export const vote = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    const { votes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return
    }

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    // Check if election is active
    const now = new Date();
    if (
      now < election.startDate ||
      now > election.endDate ||
      !election.isActive
    ) {
      res.status(400).json({
        success: false,
        message: "Election is not active",
      });
      return
    }

    // Check if user has already voted
    if (election.voters.includes(new mongoose.Types.ObjectId(userId))) {
      res.status(400).json({
        success: false,
        message: "You have already voted in this election",
      });
      return
    }

    // Validate votes
    const positions = new Set(election.positions);
    const votedPositions = new Set();

    for (const vote of votes) {
      // Check if position is valid
      if (!positions.has(vote.position)) {
        res.status(400).json({
          success: false,
          message: `Invalid position: ${vote.position}`,
        });
        return
      }

      // Check if position is voted more than once
      if (votedPositions.has(vote.position)) {
        res.status(400).json({
          success: false,
          message: `Cannot vote for multiple candidates in position: ${vote.position}`,
        });
        return
      }
      votedPositions.add(vote.position);

      // Check if candidate exists and is running for the correct position
      const candidateIndex = election.candidates.findIndex(
          (candidate) =>
            //@ts-ignore
          candidate.userId.toString() === vote.candidateId &&
          candidate.position === vote.position

          // console.log()          
      );

      if (candidateIndex === -1) {
        res.status(400).json({
          success: false,
          message: `Invalid candidate ${vote.candidateId} for position: ${vote.position}`,
        });
        return
      }

      // Add vote
      election.candidates[candidateIndex].votes += 1;
    }

    // Add user to voters list
    election.voters.push(new mongoose.Types.ObjectId(userId));
    await election.save();

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error processing vote",
      error: error.message,
    });
  }
};

export const getElections = async (req: Request, res: Response) => {
  console.log("getElections was hit");
  try {
    const elections = await Election.find({
      isActive: true,
      endDate: { $gte: new Date() },
    }).select("-voters");

    // const elections = await Election.find()

    res.status(200).json({
      success: true,
      elections,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching elections",
      error: error.message,
    });
  }
};

export const getElectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id).select("-voters");

    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    res.status(200).json({
      success: true,
      election,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching election",
      error: error.message,
    });
  }
};

export const getElectionResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);

    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    // If election is still active, only return published results
    if (election.isActive && new Date() < election.endDate) {
      const publishedResults = election.results.filter(
        (result) => result.published
      );

      res.status(200).json({
        success: true,
        electionTitle: election.title,
        isActive: true,
        results: publishedResults,
      });
    }

    // If election has ended, calculate and return all results
    const results = election.positions.map((position) => {
      const candidatesForPosition = election.candidates
        .filter((candidate) => candidate.position === position)
        .sort((a, b) => b.votes - a.votes);

      const winner =
        candidatesForPosition.length > 0
          ? {
              candidateId: candidatesForPosition[0].userId,
              name: candidatesForPosition[0].name,
              votes: candidatesForPosition[0].votes,
            }
          : null;

      return {
        position,
        candidates: candidatesForPosition.map((c) => ({
          name: c.name,
          votes: c.votes,
          percentage:
            election.voters.length > 0
              ? ((c.votes / election.voters.length) * 100).toFixed(2) + "%"
              : "0%",
        })),
        winner,
        totalVotes: candidatesForPosition.reduce((sum, c) => sum + c.votes, 0),
        published: true,
      };
    });

    res.status(200).json({
      success: true,
      electionTitle: election.title,
      isActive: election.isActive,
      endDate: election.endDate,
      totalVoters: election.voters.length,
      results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching election results",
      error: error.message,
    });
  }
};

export const publishResults = async (req: Request, res: Response) => {
  try {
    const { id, position } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    // Check if position exists
    if (!election.positions.includes(position)) {
      res.status(400).json({
        success: false,
        message: "Invalid position",
      });
      return
    }

    // Calculate results for the position
    const candidatesForPosition = election.candidates
      .filter((candidate) => candidate.position === position)
      .sort((a, b) => b.votes - a.votes);

    if (candidatesForPosition.length === 0) {
      res.status(400).json({
        success: false,
        message: "No candidates for this position",
      });
      return
    }

    const winner = {
      candidateId: candidatesForPosition[0].userId,
      name: candidatesForPosition[0].name,
      votes: candidatesForPosition[0].votes,
    };

    // Update or add result for the position
    const resultIndex = election.results.findIndex(
      (r) => r.position === position
    );
    if (resultIndex >= 0) {
      election.results[resultIndex].winner = winner;
      election.results[resultIndex].published = true;
    } else {
      election.results.push({
        position,
        winner,
        published: true,
      });
    }

    await election.save();

    res.status(200).json({
      success: true,
      message: `Results for ${position} published successfully`,
      result: {
        position,
        winner,
        candidates: candidatesForPosition.map((c) => ({
          name: c.name,
          votes: c.votes,
          percentage:
            election.voters.length > 0
              ? ((c.votes / election.voters.length) * 100).toFixed(2) + "%"
              : "0%",
        })),
        totalVotes: candidatesForPosition.reduce((sum, c) => sum + c.votes, 0),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error publishing results",
      error: error.message,
    });
  }
};

export const endElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });
      return
    }

    if (!election.isActive) {
      res.status(400).json({
        success: false,
        message: "Election is already ended",
      });
      return
    }

    election.isActive = false;
    election.endDate = new Date(); // Force end date to now

    // Calculate and publish all results
    election.positions.forEach((position) => {
      const candidatesForPosition = election.candidates
        .filter((candidate) => candidate.position === position)
        .sort((a, b) => b.votes - a.votes);

      if (candidatesForPosition.length > 0) {
        const winner = {
          candidateId: candidatesForPosition[0].userId,
          name: candidatesForPosition[0].name,
          votes: candidatesForPosition[0].votes,
        };

        const resultIndex = election.results.findIndex(
          (r) => r.position === position
        );
        if (resultIndex >= 0) {
          election.results[resultIndex].winner = winner;
          election.results[resultIndex].published = true;
        } else {
          election.results.push({
            position,
            winner,
            published: true,
          });
        }
      }
    });

    await election.save();

    res.status(200).json({
      success: true,
      message: "Election ended successfully",
      election: {
        title: election.title,
        endDate: election.endDate,
        isActive: election.isActive,
        results: election.results,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error ending election",
      error: error.message,
    });
  }
};
