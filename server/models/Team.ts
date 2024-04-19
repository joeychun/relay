import { Types, Schema, model, Document } from "mongoose";

export enum TeamStatus {
  Recruiting = "recruiting",
  Active = "active",
  Ended = "ended",
}

export interface Team extends Document {
  name: string;
  dateStarted?: Date;
  dateEnded?: Date;
  users: Types.ObjectId[];
  problemAttempts: Types.ObjectId[];
  status: TeamStatus;
  code: string;
  // for easier stats
  longestStreak: number;
  currentStreak: number;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    dateStarted: { type: Date, required: false },
    dateEnded: { type: Date, required: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    problemAttempts: [{ type: Schema.Types.ObjectId, ref: "RelayProblemAttempt" }],
    code: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TeamStatus),
      default: TeamStatus.Recruiting,
      required: true,
    },
    longestStreak: { type: Number, default: 0, required: true },
    currentStreak: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

export const TeamModel = model<Team>("Team", TeamSchema);
