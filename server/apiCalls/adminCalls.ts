import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
  Team,
  TypedRequestQuery,
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
  try {
    await assertUserIsAdmin(myUserId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  if (req.body.questionsWithAnswers.length != NUM_PROBLEMS) {
    return res.status(400).json({ error: "incorrect number of questions for new problem" });
  }
  let subproblems: Subproblem[] = [];

  for (let i = 0; i < NUM_PROBLEMS; i++) {
    const subproblem = new SubproblemModel({
      index: i,
      question: req.body.questionsWithAnswers[i].question.trim(),
      answer: req.body.questionsWithAnswers[i].answer.trim(),
      // category: req.body.category,
    });
    const savedSubproblem = await subproblem.save();
    subproblems.push(savedSubproblem);
  }

  const date = new Date(req.body.date);
  date.setHours(0, 0, 0, 0);
  const problem = new RelayProblemModel({
    subproblems: subproblems,
    date,
  });
  await problem.save();
  // return res.status(200).json({ problem: savedProblem });

  const problems = await RelayProblemModel.find({})
    .populate<{
      subproblems: Subproblem[];
    }>("subproblems")
    .sort({ date: -1 }) // sort by date in desc order
    .limit(5); // get the latest five

  return res.status(200).json({ problems });
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export async function createRelayProblemAttempt(teamId: string, problemId: string) {
  // 1. create the relay problem attempt
  // 2. create the all subproblem attempts
  // something like relayProblem.subproblemAttempts.push(createSubproblemAttempt());
  // strip time of date
  const relayProblemAttempt = new RelayProblemAttemptModel({
    problem: problemId,
    team: teamId,
  });
  const savedAttempt = await relayProblemAttempt.save();

  const team = await TeamModel.findById(teamId).populate<{
    users: User[];
  }>("users");
  if (!team) {
    throw new Error("Team not found");
  }
  if (team.status != TeamStatus.Active) {
    throw new Error("Team is not active");
  }
  const teamUsers = team.users.map((user) => user._id.toString());

  if (teamUsers.length != NUM_PROBLEMS) {
    throw new Error("Incorrect number of members");
  }

  const shuffledUsers = shuffleArray(teamUsers);
  const parentRelayProblem = await RelayProblemModel.findById(problemId).populate<{
    subproblems: Subproblem[];
  }>("subproblems");
  if (!parentRelayProblem || parentRelayProblem.subproblems.length != NUM_PROBLEMS) {
    // should not happen
    throw new Error("no parent problem found");
  }

  const savedAttemptWithSubproblemAttempts = await RelayProblemAttemptModel.findById(
    savedAttempt._id
  ).populate<{
    subproblemAttempts: SubproblemAttempt[];
  }>("subproblemAttempts");

  if (!savedAttemptWithSubproblemAttempts) {
    throw new Error("should not happen");
  }

  for (let i = 0; i < NUM_PROBLEMS; i++) {
    const newSubproblemAttempt = (await createSubproblemAttempt(
      savedAttemptWithSubproblemAttempts._id,
      shuffledUsers[i],
      i
    )) as SubproblemAttempt;
    savedAttemptWithSubproblemAttempts.subproblemAttempts.push(newSubproblemAttempt);
  }
  const updatedRelayProblemAttempt = await savedAttemptWithSubproblemAttempts.save();
  return updatedRelayProblemAttempt;
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
  const parentRelayProblem = await RelayProblemModel.findById(parentProblemAttempt).populate<{
    subproblems: Subproblem[];
  }>("subproblems");
  if (!parentRelayProblem) {
    // should not happen
    throw new Error("no parent problem found");
  }
  const team = (await TeamModel.findById(parentProblemAttempt.team)) as Team;
  if (parentProblemAttempt.subproblemAttempts.length != parentRelayProblem.subproblems.length) {
    // longest streak not affected, current streak is now 0
    team.currentStreak = 0;
  } else {
    const gotAllRight = parentRelayProblem.subproblems.every((subproblem, i) => {
      return parentProblemAttempt.subproblemAttempts[i].answer === subproblem.answer;
    });
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

const publishProblem = async (
  req: TypedRequestBody<updateProblemStatusRequestBodyType>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  try {
    await assertUserIsAdmin(myUserId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const teams: Team[] = await getAllActiveTeams();

  const thisProblem = (await RelayProblemModel.findById(req.body.problemId)) as RelayProblem;

  // check no active problem exists already
  const activeProblem = await RelayProblemModel.findOne({
    status: ProblemStatus.Active,
  });
  if (!!activeProblem) {
    return res.status(400).json({ error: "Active problem already exists." });
  }
  var errorFromCreating;
  await Promise.all(teams.map((team) => createRelayProblemAttempt(team.id, req.body.problemId)))
    .then((results) => {
      console.log("Success", results);
    })
    .catch((error) => {
      console.log("ERROR WHEN CREATING", error);
      errorFromCreating = error;
    });

  if (!!errorFromCreating) {
    res.status(400).json({ error: errorFromCreating });
    return;
  }
  thisProblem.status = ProblemStatus.Active;
  await thisProblem.save();

  const problems = await RelayProblemModel.find({})
    .populate<{
      subproblems: Subproblem[];
    }>("subproblems")
    .sort({ date: -1 }) // sort by date in desc order
    .limit(5); // get the latest five

  return res.status(200).json({ problems });

  // later can use a script to automatically release at midnight, but for now use manual release
  // for all *active* teams, create a RelayProblemAttempt
};

const releaseAnswer = async (
  req: TypedRequestBody<updateProblemStatusRequestBodyType>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  try {
    await assertUserIsAdmin(myUserId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const problem = await RelayProblemModel.findById(req.body.problemId);
  if (!problem) {
    return res.status(400).json({ error: "Problem not found" });
  }
  problem.status = ProblemStatus.Revealed;
  const savedProblem = await problem.save();

  const relayProblemAttempts = await RelayProblemAttemptModel.find({
    problem: savedProblem,
  });

  // TODO: use lock?
  var errorFromCreating;
  await Promise.all(relayProblemAttempts.map((attempt) => gradeRelayProblemAttempt(attempt._id)))
    .then((results) => {
      console.log("Success", results);
    })
    .catch((error) => {
      console.log("ERROR WHEN CREATING", error);
      error = errorFromCreating;
    });

  if (!!errorFromCreating) {
    res.status(400).json({ error: errorFromCreating });
    return;
  }
  console.log(`Problem with id ${req.body.problemId} revealed`);
  const problems = await RelayProblemModel.find({})
    .populate<{
      subproblems: Subproblem[];
    }>("subproblems")
    .sort({ date: -1 }) // sort by date in desc order
    .limit(5); // get the latest five

  return res.status(200).json({ problems });
};

const loadRecentProblems = async (
  req: TypedRequestQuery<{}>,
  res // problemResponseType
) => {
  const myUserId: string = req.user?._id as string;
  try {
    await assertUserIsAdmin(myUserId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const problems = await RelayProblemModel.find({})
    .populate<{
      subproblems: Subproblem[];
    }>("subproblems")
    .sort({ date: -1 }) // sort by date in desc order
    .limit(5); // get the latest five

  return res.status(200).json({ problems });
};

export default {
  createProblem,
  publishProblem,
  releaseAnswer,
  loadRecentProblems,
};
