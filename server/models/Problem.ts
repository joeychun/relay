import { Schema, Types, model, Document } from "mongoose";

// Actual problems

// Subproblem

export enum SubproblemCategory {
  Geometry = "geometry",
  Algebra = "algebra",
  NumberTheory = "number_theory",
  Combinatorics = "combinatorics",
  Probability = "probability",
  Trigonometry = "trigonometry",
  Calculus = "calculus",
  Logic = "logic",
  Other = "other",
}

export interface Subproblem extends Document {
  index: number;
  question: string;
  answer: number;
  category: SubproblemCategory;
}

const SubproblemSchema: Schema = new Schema({
  index: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: Number, required: true },
  category: { type: String, enum: Object.values(SubproblemCategory), required: true },
});

// RelayProblem

export enum ProblemStatus {
  Pending = "draft",
  Active = "active",
  Revealed = "revealed",
}

export interface RelayProblem extends Document {
  subproblems: Subproblem[];
  date: Date; // date the problem is for
  status: ProblemStatus;
}

const RelayProblemSchema: Schema = new Schema({
  subproblems: { type: [SubproblemSchema], required: true },
  date: { type: Date, required: true },
  released: {
    type: String,
    enum: Object.values(ProblemStatus),
    default: ProblemStatus.Pending,
    required: true,
  },
});

// Attempts of the problems

// SubproblemAttempt

export interface SubproblemAttempt extends Document {
  parentProblemAttempt: Types.ObjectId;
  assignedUser: Types.ObjectId;
  answer?: number; // If answer is not undefined, it means the user has submitted
  submittedAt?: Date;
}

const SubproblemAttemptSchema: Schema = new Schema({
  parentProblemAttempt: { type: Schema.Types.ObjectId, ref: "RelayProblemAttempt", required: true },
  assignedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answer: { type: Number, required: false },
  submittedAt: { type: Date, required: false },
});

// RelayProblemAttempt Schema
export interface RelayProblemAttempt extends Document {
  problem: Types.ObjectId;
  team: Types.ObjectId;
  subproblemAttempts: Types.ObjectId[];
}

const RelayProblemAttemptSchema: Schema = new Schema({
  problem: { type: Schema.Types.ObjectId, ref: "RelayProblem", required: true },
  team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  subproblemAttempts: [{ type: Schema.Types.ObjectId, ref: "SubproblemAttempt" }],
});

export const SubproblemModel = model<Subproblem>("Subproblem", SubproblemSchema);
export const RelayProblemModel = model<RelayProblem>("RelayProblem", RelayProblemSchema);
export const SubproblemAttemptModel = model<SubproblemAttempt>(
  "SubproblemAttempt",
  SubproblemAttemptSchema
);
export const RelayProblemAttemptModel = model<RelayProblemAttempt>(
  "RelayProblemAttempt",
  RelayProblemAttemptSchema
);
