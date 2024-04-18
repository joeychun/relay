import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
  Team,
  User,
  addProblemRequestBodyType,
  problemResponseType,
  updateProblemStatusRequestBodyType,
} from "../../shared/apiTypes";

import { TypedRequestBody } from "../../shared/apiTypes";
import socketManager from "../server-socket";
import { Types, UpdateWriteOpResult } from "mongoose";
import {
  ProblemStatus,
  RelayProblem,
  RelayProblemAttemptModel,
  RelayProblemModel,
  Subproblem,
  SubproblemAttempt,
  SubproblemModel,
} from "../models/Problem";
import { createSubproblemAttempt } from "./problemCalls";
import { TeamModel, TeamStatus } from "../models/Team";

async function assertUserIsAdmin(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist.");
  }
  if (!user.isAdmin) {
    throw new Error("User is not admin.");
  }
}

async function getAllActiveTeams() {
  const teams = await TeamModel.find({ status: TeamStatus.Active });
  return teams;
}

// ONLY IF ADMIN
const createProblem = async (
  req: TypedRequestBody<addProblemRequestBodyType>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  await assertUserIsAdmin(myUserId);

  if (
    req.body.questions.length != NUM_PROBLEMS ||
    req.body.answers.length != NUM_PROBLEMS
  ) {
    throw new Error("incorrect number of questions for new problem");
  }

  let subproblems: Subproblem[] = [];

  for (let i = 0; i < NUM_PROBLEMS; i++) {
    const subproblem = new SubproblemModel({
      index: i,
      question: req.body.questions[i],
      answer: req.body.answers[i].trim(),
      category: req.body.category,
    });
    const savedSubproblem = await subproblem.save();
    subproblems.push(savedSubproblem);
  }

  req.body.date.setHours(0, 0, 0, 0);
  const problem = new RelayProblemModel({
    subproblems: subproblems,
    date: req.body.date,
  });
  const savedProblem = await problem.save();
  return res.status(200).json({ problem: savedProblem });
};

export async function createRelayProblemAttempt(
  teamId: string,
  problemId: string
) {
  // 1. create the relay problem attempt
  // 2. create the first subproblem attempt
  // something like relayProblem.subproblemAttempts.push(createSubproblemAttempt());
  // strip time of date
  const relayProblemAttempt = new RelayProblemAttemptModel({
    problem: problemId,
    team: teamId,
  });
  const savedAttempt = await relayProblemAttempt.save();
  await createSubproblemAttempt(savedAttempt._id);
  return savedAttempt;
}

async function gradeRelayProblemAttempt(relayProblemAttemptId: string) {
  // go through the subproblems and check that the answer matches up
  const parentProblemAttempt = await RelayProblemAttemptModel.findById(
    relayProblemAttemptId
  ).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
  if (!parentProblemAttempt) {
    // should not happen
    throw new Error("no parent problem found");
  }
  const parentRelayProblem = await RelayProblemModel.findById(
    parentProblemAttempt
  ).populate<{ subproblems: Subproblem[] }>("subproblems");
  if (!parentRelayProblem) {
    // should not happen
    throw new Error("no parent problem found");
  }
  const team = (await TeamModel.findById(parentProblemAttempt.team)) as Team;
  if (
    parentProblemAttempt.subproblemAttempts.length !=
    parentRelayProblem.subproblems.length
  ) {
    // longest streak not affected, current streak is now 0
    team.currentStreak = 0;
  } else {
    const gotAllRight = parentRelayProblem.subproblems.every(
      (subproblem, i) => {
        return (
          parentProblemAttempt.subproblemAttempts[i].answer ===
          subproblem.answer
        );
      }
    );
    if (gotAllRight) {
      team.currentStreak += 1;
      team.longestStreak = Math.max(team.currentStreak, team.longestStreak);
    } else {
      // longest streak not affected, current streak is now 0
      team.currentStreak = 0;
    }
  }
  const savedTeam = await team.save();
  return savedTeam;
}

const releaseProblem = async (
  req: TypedRequestBody<updateProblemStatusRequestBodyType>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  await assertUserIsAdmin(myUserId);

  const teams: Team[] = await getAllActiveTeams();

  const thisProblem = (await RelayProblemModel.findById(
    req.body.problemId
  )) as RelayProblem;

  // check no active problem exists already
  const activeProblem = await RelayProblemModel.findOne({
    status: ProblemStatus.Active,
  });
  if (!!activeProblem) {
    throw new Error("Active problem already exists.");
  }
  Promise.all(
    teams.map((team) => createRelayProblemAttempt(team.id, req.body.problemId))
  )
    .then((results) => {
      console.log("Success", results);
    })
    .catch((error) => {
      throw new Error("Error releasing problem");
    });
  thisProblem.status = ProblemStatus.Active;
  const releasedProblem = await thisProblem.save();

  // later can use a script to automatically release at midnight, but for now use manual release
  // for all *active* teams, create a RelayProblemAttempt
  return res.status(200).json({ problem: releasedProblem });
};

const closeProblem = async (
  req: TypedRequestBody<updateProblemStatusRequestBodyType>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  await assertUserIsAdmin(myUserId);

  const problem = await RelayProblemModel.findById(req.body.problemId);
  if (!problem) {
    throw new Error("Problem not found");
  }
  problem.status = ProblemStatus.Revealed;
  const savedProblem = await problem.save();

  const relayProblemAttempts = await RelayProblemAttemptModel.find({
    problem: savedProblem,
  });

  // TODO: use lock?
  Promise.all(
    relayProblemAttempts.map((attempt) => gradeRelayProblemAttempt(attempt._id))
  )
    .then((results) => {
      console.log("Success", results);
    })
    .catch((error) => {
      throw new Error("Error grading problem");
    });

  console.log(`Problem with id ${req.body.problemId} revealed`);
  return res.status(200).json({ problem: savedProblem });
};

export default {
  createProblem,
  releaseProblem,
  closeProblem,
};
