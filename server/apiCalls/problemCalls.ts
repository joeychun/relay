import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
  TypedRequestQuery,
  User,
  getUserActiveOrRecruitingTeam,
  getUserActiveTeam,
  getUserTeams,
  lock,
  submitSubproblemAttemptRequestBodyType,
  subproblemAttemptResponseType,
} from "../../shared/apiTypes";

import { TypedRequestBody } from "../../shared/apiTypes";
import socketManager from "../server-socket";
import mongoose, { Types, UpdateWriteOpResult } from "mongoose";
import { Team, TeamModel } from "../models/Team";
import {
  ProblemStatus,
  RelayProblem,
  RelayProblemAttempt,
  RelayProblemAttemptModel,
  RelayProblemModel,
  Subproblem,
  SubproblemAttempt,
  SubproblemAttemptModel,
  SubproblemModel,
} from "../models/Problem";

export async function createSubproblemAttempt(
  relayProblemAttemptId: string,
  userId: string,
  index: number
) {
  const parentProblemAttempt = await RelayProblemAttemptModel.findById(
    relayProblemAttemptId
  ).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
  if (!parentProblemAttempt) {
    // should not happen
    throw new Error("no parent problem found");
  }
  if (parentProblemAttempt.subproblemAttempts.length == NUM_PROBLEMS) {
    throw new Error("should not be creating a new subproblem attempt");
  }
  if (parentProblemAttempt.subproblemAttempts.length != index) {
    throw new Error("Something went wrong");
  }

  const parentRelayProblem = await RelayProblemModel.findById(
    parentProblemAttempt.problem
  ).populate<{ subproblems: Subproblem[] }>("subproblems");

  if (!parentRelayProblem) {
    // should not happen
    throw new Error("no parent problem found");
  }

  const nextSubproblemAttempt = new SubproblemAttemptModel({
    parentProblemAttempt: relayProblemAttemptId,
    subproblem: parentRelayProblem.subproblems[parentProblemAttempt.subproblemAttempts.length],
    assignedUser: userId,
  });
  const savedSubproblemAttempt = await nextSubproblemAttempt.save();
  console.log("Added new subproblem attempt");
  return savedSubproblemAttempt;
}

const submitSubproblemAttempt = async (
  req: TypedRequestBody<submitSubproblemAttemptRequestBodyType>,
  res // subproblemAttemptResponseType
) => {
  const myUserId: string = req.user?._id as string;
  const subproblemAttempt = await SubproblemAttemptModel.findById(req.body.subproblemAttemptId);
  if (!subproblemAttempt) {
    return res.status(404).json({ error: "No subproblem attempt found." });
  }
  if (subproblemAttempt.assignedUser._id.toString() != myUserId) {
    return res.status(400).json({ error: "This problem has not been assigned to you." });
  }
  const subproblem = (await SubproblemModel.findById(subproblemAttempt.subproblem)) as Subproblem;
  // TODO: will this lock create an issue?
  await lock.acquire([subproblemAttempt?.parentProblemAttempt], async () => {
    subproblemAttempt.answer = req.body.answer.trim();
    const savedAttempt = await subproblemAttempt.save();

    // get parent problem
    const parentProblemAttempt = await RelayProblemAttemptModel.findById(
      subproblemAttempt.parentProblemAttempt
    ).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
    if (!parentProblemAttempt) {
      // should not happen
      return res.status(404).json({ error: "No parent problem found" });
    }

    const parentRelayProblem = await RelayProblemModel.findById(
      parentProblemAttempt.problem
    ).populate<{ subproblems: Subproblem[] }>("subproblems");
    if (!parentRelayProblem) {
      // should not happen
      return res.status(404).json({ error: "No parent problem found" });
    }

    // TODO: LATER EXTENSION - show progress of where your teammates are.
    if (
      parentProblemAttempt.subproblemAttempts.length < NUM_PROBLEMS &&
      parentProblemAttempt.subproblemAttempts[parentProblemAttempt.subproblemAttempts.length - 1]
        ._id == subproblemAttempt._id
    ) {
      // TODO: notify the next user here
    }

    return res.status(200).json({
      subproblemAttempt: savedAttempt,
      subproblemData: {
        question: subproblem.question,
        category: subproblem.category,
      },
    });
  });
};

const loadSubproblemAttempt = async (
  req: TypedRequestQuery<{}>,
  res // subproblemAttemptResponseType: subproblem, subproblemAttempt (can be null)
) => {
  // Takes in userid
  // find active problem
  // find active team with user, then find relayProblemAttempt with that team
  // that uses the problem and team, then find a subproblem with the user and attempt
  // return the subproblem
  // and answer submitted

  // the returned object might be null if it's not the user's turn yet or if there's no active team

  const myUserId: string = req.user?._id as string;

  var subproblemAttempt;
  var subproblem;
  var problemAttempt;
  const activeProblem = await RelayProblemModel.findOne({
    status: ProblemStatus.Active,
  });
  const myTeam = await getUserActiveTeam(myUserId);

  if (!!activeProblem && !!myTeam) {
    problemAttempt = await RelayProblemAttemptModel.findOne({
      problem: activeProblem,
      team: myTeam,
    }).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
    if (!!problemAttempt) {
      subproblemAttempt = await SubproblemAttemptModel.findOne({
        parentProblemAttempt: problemAttempt,
        assignedUser: myUserId,
      });
      subproblem = await SubproblemModel.findById(subproblemAttempt.subproblem);
    } else {
      console.log("Active team and problem, but no attempt found.");
    }
  } else {
    console.log("No active problem or team found");
  }

  return res.status(200).json({
    mySubproblemIndex: subproblem?.index ?? -1,
    subproblemData: {
      question: subproblem?.question,
      category: subproblem?.category,
    },
    subproblemAttempts: problemAttempt?.subproblems,
  });
};

const loadRandomSubproblem = async (req: TypedRequestQuery<{}>, res) => {
  const randomProblem = await SubproblemModel.findOne();

  return res.status(200).json({
    subproblemData: {
      question: randomProblem?.question,
      category: randomProblem?.category,
    },
  });
};

const loadProblemResults = async (
  req: TypedRequestBody<{}>,
  res // loadProblemResultsResponseType
) => {
  const myUserId: string = req.user?._id as string;

  // get the latest revealed problem and show results
  const latestRevealedProblem = await RelayProblemModel.find({
    status: ProblemStatus.Revealed,
  })
    .sort({ date: -1 }) // sort by date in desc order
    .limit(1); // get the latest one

  const userTeams = await getUserTeams(myUserId);
  const problemAttempt = await RelayProblemAttemptModel.findOne({
    problem: latestRevealedProblem,
    team: { $in: userTeams.map((team) => team._id) },
  }).populate<{ team: Team }>("team");

  return res.status(200).json({
    relayProblem: latestRevealedProblem,
    relayProblemAttempt: problemAttempt,
  });
};

export default {
  submitSubproblemAttempt,
  loadSubproblemAttempt,
  loadRandomSubproblem,
  loadProblemResults,
};
