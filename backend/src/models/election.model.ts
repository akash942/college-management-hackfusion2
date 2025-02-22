import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate {
  userId: mongoose.Types.ObjectId;
  name: string;
  position: string;
  manifesto: string;
  votes: number;
}

export interface IElection extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  positions: string[];
  candidates: ICandidate[];
  voters: mongoose.Types.ObjectId[];
  isActive: boolean;
  results: {
    position: string;
    winner: {
      candidateId: mongoose.Types.ObjectId;
      name: string;
      votes: number;
    };
    published: boolean;
  }[];
}

const electionSchema = new Schema<IElection>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  positions: [{
    type: String,
    required: true
  }],
  candidates: [{
    _id: {type: mongoose.Schema.Types.ObjectId},
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    manifesto: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  voters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  results: [{
    position: {
      type: String,
      required: true
    },
    winner: {
      candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      votes: Number
    },
    published: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IElection>('Election', electionSchema);