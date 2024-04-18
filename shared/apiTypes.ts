import Express from "express";
import { Query, Send } from "express-serve-static-core";
import { Server, Socket } from "socket.io";
import express, {
  Application,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

var AsyncLock = require("async-lock");

export const lock = new AsyncLock();

import UserModel, { User } from "../server/models/User";
import {
  RelayProblem,
  Subproblem,
  SubproblemAttempt,
  RelayProblemAttempt,
  SubproblemCategory,
} from "../server/models/Problem";
import { Team, TeamModel, TeamStatus } from "../server/models/Team";

export {
  User,
  Subproblem,
  RelayProblem,
  SubproblemAttempt,
  RelayProblemAttempt,
  Team,
  ExpressResponse,
};

export interface TypedRequestBody<T> extends ExpressRequest {
  body: T;
  user?: User;
}
export interface TypedRequestQuery<T extends Query> {
  query: T;
  user?: User;
}

export const NUM_PROBLEMS = 3; // for now

export async function getUserActiveOrRecruitingTeam(userId: string) {
  const team = await TeamModel.findOne({
    users: userId,
    status: { $in: [TeamStatus.Recruiting, TeamStatus.Active] },
  });
  return team;
}

export async function getUserActiveTeam(userId: string) {
  const team = await TeamModel.findOne({
    users: userId,
    status: TeamStatus.Active,
  });
  return team;
}

export async function getMyUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}

export async function getTeamWithUsers(teamId: string) {
  const team = await TeamModel.findById(teamId).populate<{
    users: User[];
  }>("users");
  if (!team) {
    throw new Error(`Team with id ${teamId} not found`);
  }
  return team;
}

export async function getUserTeams(userId: string) {
  const teams = await TeamModel.find({
    users: userId,
  });
  return teams;
}

// Admin

export type addProblemRequestBodyType = {
  questions: string[];
  answers: string[];
  date: Date;
  category: SubproblemCategory;
};

export type updateProblemStatusRequestBodyType = {
  problemId: string;
};

export type problemResponseType = { problem: RelayProblem };

// Player

export type submitSubproblemAttemptRequestBodyType = {
  subproblemAttemptId: string;
  answer: string;
};

export type SubproblemData = {
  category: SubproblemCategory;
  question: string;
};

export type subproblemAttemptResponseType = {
  subproblemAttempt: SubproblemAttempt;
  subproblemData: SubproblemData;
};

// export enum ProblemResultType {
//   Correct = "correct",
//   Incorrect = "incorrect",
//   Unanswered = "unanswered",
// }

export type loadProblemResultsResponseType = {
  relayProblem: RelayProblem;
  relayProblemAttempt: RelayProblemAttempt; // with team info too
};

export type setUserNameRequestBodyType = {
  name: string;
};

export type createTeamRequestBodyType = {
  name: string;
};

export type publishTeamRequestBodyType = {
  teamId: string;
};

export type getUserTeamsResponseType = {
  teams: Team[];
};

export type teamRequestBodyType = {
  teamId: string;
};

export type teamResponseType = {
  team: Team;
};
