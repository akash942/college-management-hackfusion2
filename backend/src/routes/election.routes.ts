import { Router } from 'express';
import { 
  createElection,
  addCandidate,
  vote,
  getElections,
  getElectionById,
  getElectionResults,
  publishResults,
  endElection
} from '../controllers/election.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

// Public routes
router.get('/', getElections);
router.get('/:id', getElectionById);
router.get('/:id/results', getElectionResults);

// Protected routes
router.post('/create', authenticateUser, authorizeRoles(UserRole.ADMIN), createElection);
router.post('/:electionId/candidates', authenticateUser, authorizeRoles(UserRole.ADMIN), addCandidate);
router.post('/:electionId/vote', authenticateUser, vote);
router.post('/:id/results/:position/publish', authenticateUser, authorizeRoles(UserRole.ADMIN), publishResults);
router.post('/:id/end', authenticateUser, authorizeRoles(UserRole.ADMIN), endElection);

export default router;