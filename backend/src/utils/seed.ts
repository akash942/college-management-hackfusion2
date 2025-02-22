import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import UserModel, { UserRole, IUser } from '../models/user.model';
import ElectionModel, { IElection } from '../models/election.model';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_election_system';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate random users
const createUsers = async (count: number) => {
  const users: IUser[] = [];
  const departments = ['Computer Science', 'Business', 'Engineering', 'Arts', 'Medicine', 'Law'];
  const roles = Object.values(UserRole);
  
  console.log(`Generating ${count} users...`);
  
  // Create users with different roles
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const fullName = `${firstName}_${lastName}`.split("'").join("")
    
    const userData: Partial<IUser> = {
      email: fullName + '@college.edu',
      password: 'Password123!', // Default password for all test users
      firstName,
      lastName,
      role,
      department: departments[Math.floor(Math.random() * departments.length)],
      isEmailVerified: true,
    };
    
    // Add role-specific fields
    if (role === UserRole.STUDENT) {
      userData.studentId = `ST${faker.string.numeric(6)}`;
    } else if (role === UserRole.FACULTY) {
      userData.facultyId = `FAC${faker.string.numeric(4)}`;
    }
    
    const user = new UserModel(userData);
    await user.save();
    users.push(user);
  }
  
  console.log(`${count} users generated successfully`);
  return users;
};

// Generate random elections
const createElections = async (users: IUser[]) => {
  const positions = [
    'Student Body President',
    'Vice President',
    'Treasurer',
    'Secretary',
    'Department Representative',
    'Social Committee Chair',
    'Academic Affairs Officer'
  ];
  
  const elections: IElection[] = [];
  const numElections = 3;
  
  console.log(`Generating ${numElections} elections...`);
  
  // Find student users for candidates
  const studentUsers = users.filter(user => user.role === UserRole.STUDENT);
  
  for (let i = 0; i < numElections; i++) {
    // Determine election status (past, current, future)
    let startDate, endDate, isActive;
    const currentDate = new Date();
    
    if (i === 0) {
      // Past election
      startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 3);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      isActive = false;
    } else if (i === 1) {
      // Current active election
      startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 3);
      endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 7);
      isActive = true;
    } else {
      // Future election
      startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() + 1);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      isActive = true;
    }
    
    // Generate random election positions (3-5 positions per election)
    const electionPositions = [...positions]
      .sort(() => 0.5 - Math.random())
      .slice(0, faker.number.int({ min: 3, max: 5 }));
    
    // Create candidates for each position
    const candidates = [];
    const usedUserIds = new Set();
    
    for (const position of electionPositions) {
      // 2-4 candidates per position
      const candidatesCount = faker.number.int({ min: 2, max: 4 });
      
      for (let j = 0; j < candidatesCount; j++) {
        // Find an unused student
        let candidateUser;
        do {
          candidateUser = studentUsers[Math.floor(Math.random() * studentUsers.length)];
          //@ts-ignore
        } while (usedUserIds.has(candidateUser._id.toString()));
        //@ts-ignore
        usedUserIds.add(candidateUser._id.toString());
        
        candidates.push({
          userId: candidateUser._id,
          name: `${candidateUser.firstName} ${candidateUser.lastName}`,
          position,
          manifesto: faker.lorem.paragraphs(2),
          votes: i === 0 ? faker.number.int({ min: 5, max: 50 }) : 0 // Only past elections have votes
        });
      }
    }
    
    // Create voters list for past elections
    const voters = [];
    if (i === 0) {
      // Add random voters from student population for past election
      const voterCount = faker.number.int({ min: 30, max: 100 });
      const potentialVoters = [...studentUsers];
      
      for (let v = 0; v < Math.min(voterCount, potentialVoters.length); v++) {
        const randomIndex = Math.floor(Math.random() * potentialVoters.length);
        const voter = potentialVoters.splice(randomIndex, 1)[0];
        voters.push(voter._id);
      }
    }
    
    // Create results for past elections
    const results = [];
    if (i === 0) {
      // Group candidates by position
      const positionCandidates: Record<string, any[]> = {};
      candidates.forEach(candidate => {
        if (!positionCandidates[candidate.position]) {
          positionCandidates[candidate.position] = [];
        }
        positionCandidates[candidate.position].push(candidate);
      });
      
      // Find winner for each position
      for (const position in positionCandidates) {
        const positionResults = positionCandidates[position].sort((a, b) => b.votes - a.votes);
        const winner = positionResults[0];
        
        results.push({
          position,
          winner: {
            candidateId: winner.userId,
            name: winner.name,
            votes: winner.votes
          },
          published: true
        });
      }
    }
    
    // Create the election
    const election = new ElectionModel({
      title: `${['Spring', 'Fall', 'Summer'][i]} Student Election ${currentDate.getFullYear()}`,
      description: faker.lorem.paragraph(),
      startDate,
      endDate,
      positions: electionPositions,
      candidates,
      voters,
      isActive,
      results
    });
    
    await election.save();
    elections.push(election);
  }
  
  console.log(`${numElections} elections generated successfully`);
  return elections;
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('Database cleared');
    
    // Generate data
    const users = await createUsers(50);
    await createElections(users);
    
    console.log('Database seeded successfully');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedDatabase();
});