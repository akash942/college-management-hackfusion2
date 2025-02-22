import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle, Clock, Users } from "lucide-react";

const urls = {
  url3: "",
  url1: "data:image/jpeg;base64,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",
  url2: "data:image/jpeg;base64,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"
};

interface Candidate {
  userId: string
  name: string;
  position: string;
  manifesto: string;
  votes: number;
  imageUrl: string;
  department: string;
  year: string;
}

interface Election {
  id: string;
  title: string;
  status: "upcoming" | "active" | "completed";
  startDate: string;
  endDate: string;
  totalVoters: number;
  votesCount: number; // Fixed property name to match usage
  positions: string[];
  candidates: Candidate[];
}

const ElectionsComponent: React.FC = () => {
  // Sample election data
  const [currentElection, setCurrentElection] = useState<Election>({
    id: "1",
    title: "Student Council Elections 2025",
    status: "active",
    startDate: "2025-02-15",
    endDate: "2025-02-20",
    totalVoters: 3000,
    votesCount: 2150, // Matches the interface property name
    positions: ["President", "Vice President", "Secretary"],
    candidates: [
      {
        userId: "1",
        name: "Alex Johnson",
        position: "President",
        manifesto: "Focus on improving campus facilities and student welfare",
        votes: 850,
        imageUrl: urls.url2,
        department: "Computer Science",
        year: "Third Year",
      },
      {
        userId: "2",
        name: "Sarah Chen",
        position: "President",
        manifesto: "Emphasis on academic excellence and research opportunities",
        votes: 5,
        imageUrl: urls.url1,
        department: "Engineering",
        year: "Fourth Year",
      },
      // Add more candidates as needed
    ],
  });

  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [position, setSelectedPosition] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const handleVote = (candidate: Candidate) => {
    console.log(candidate.userId)
    if (!hasVoted) {
      setSelectedCandidate(candidate.userId);
      setSelectedPosition(candidate.position)
    }
  };

  const log = (candidate) => {
    console.log("candidate: ",JSON.stringify(candidate))
    return ""
  }

  const confirmVote = async () => {
    if (selectedCandidate && !hasVoted) {
      // Here you would typically make an API call to record the vote
      console.log("Voted for: ", selectedCandidate);
      setHasVoted(true);
      // Update the local state to reflect the vote
      const updatedCandidates = currentElection.candidates.map((candidate) => {
        if (candidate.userId === selectedCandidate) {
          return { ...candidate, votes: candidate.votes + 1 };
        }
        return candidate;
      });
      setCurrentElection({
        ...currentElection,
        votesCount: currentElection.votesCount + 1, // Using consistent property name
        candidates: updatedCandidates,
      });

      //TODO: Update the backend with the vote
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/elections/${currentElection._id}/vote`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({votes:[{ candidateId: selectedCandidate, position: position }]}),
      });

      const data = await res.json()
      console.log("data: ", data)
    }
  };

  const getVotePercentage = (votes: number) => {
    // console.log("votes: ", votes)
    // console.log(currentElection.votesCount)
    return ((votes / currentElection.votesCount) * 100).toFixed(1);
  };

  const getTimeRemaining = () => {
    const end = new Date(currentElection.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  };

  async function fetchCandidates(){
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("fetching from: ", `${import.meta.env.VITE_BACKEND_API_URL}/api/elections`)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/elections`)
      const data = await response.json()
      console.log("data: ", data.elections)
      console.log(data.elections[0])
      setCurrentElection(data.elections[0])
      setLoading(false)
      // setCurrentElection((prevElection) => ({
      //   ...prevElection,
      //   candidates: [
      //     ...prevElection.candidates,
      //     {
      //       id: "3",
      //       name: "John Doe",
      //       position: "Vice President",
      //       manifesto: "Promoting student engagement and inclusion",
      //       votes: 0,
      //       imageUrl: urls.url3,
      //       department: "Business",
      //       year: "Second Year",
      //     },
      //   ],
      // }));
      
    } catch (err: any) {
      console.error("error occured: ", err.message)
    }
  }

  useEffect(()=>{
    fetchCandidates()
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Election Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {currentElection.title}
          </h2>
          <Badge
            variant={
              currentElection.status === "active" ? "default" : "secondary"
            }
            className="text-sm"
          >
            {"active" || currentElection.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {getTimeRemaining()}
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            {currentElection.votesCount} / {currentElection.totalVoters} votes
            cast
          </div>
        </div>
      </div>

      {/* Voting Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Progress</CardTitle>
          <CardDescription>Overall voting participation</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={
              (currentElection.votesCount / currentElection.totalVoters) * 100
            }
            className="h-2"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {(
              (currentElection.votesCount / currentElection.totalVoters) *
              100
            ).toFixed(1)}
            % participation
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="vote" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="results">Live Results</TabsTrigger>
        </TabsList>

        {/* Voting Tab */}
        <TabsContent value="vote">
          {hasVoted ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Thank you for voting! You can view the live results in the
                Results tab.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentElection.candidates.map((candidate) => (
                <Card
                  key={candidate.userId}
                  className={`cursor-pointer transition-all ${
                    selectedCandidate === candidate.userId
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => handleVote(candidate)}
                >
                  <CardHeader>
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4"
                    />
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>
                      {candidate.position} Candidate
                      <br />
                      {candidate.department} | {candidate.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{candidate.manifesto}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={
                        selectedCandidate === candidate.userId
                          ? "default"
                          : "outline"
                      }
                      className="w-full"
                      onClick={() => handleVote(candidate.userId)}
                    >
                      {selectedCandidate === candidate.userId
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {selectedCandidate && !hasVoted && (
            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={confirmVote}>
                Confirm Vote
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <div className="space-y-6">
            {currentElection.positions.map((position) => (
              <Card key={position}>
                <CardHeader>
                  <CardTitle>{position} Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentElection.candidates
                      .filter((c) => c.position === position)
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, index) => (
                        <div key={candidate.userId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {index === 0 && (
                                <Award className="h-4 w-4 text-yellow-500" />
                              )}
                              <span>{candidate.name}</span>
                            </div>
                            <span className="font-medium">
                              {getVotePercentage(candidate.votes)}%
                            </span>
                          </div>
                          <Progress
                            value={
                              (candidate.votes / currentElection.votesCount) *
                              100
                            }
                            className="h-2"
                          />
                          <p className="text-sm text-muted-foreground">
                            {candidate.votes} votes
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionsComponent;
