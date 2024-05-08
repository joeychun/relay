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
  subproblemAttemptRequestBodyType,
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
import { alertSendback, alertTurn } from "./emailCalls";

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
    throw new Error("no parent attempt found");
  }
  if (parentProblemAttempt.subproblemAttempts.length == NUM_PROBLEMS) {
    throw new Error("should not be creating a new subproblem attempt");
  }
  if (index >= NUM_PROBLEMS) {
    throw new Error("invalid subproblem key");
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
    subproblem: parentRelayProblem.subproblems[index],
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

    // TODO: LATER EXTENSION - show progress of where your teammates are.
    // Not the last one, so notify
    if (subproblem.index < parentProblemAttempt.subproblemAttempts.length - 1) {
      // TODO: notify the next user here
      try {
        const nextSubproblemAttempt = parentProblemAttempt.subproblemAttempts[subproblem.index + 1];
        const userToNotify = (await UserModel.findById(nextSubproblemAttempt.assignedUser)) as User;

        await alertTurn(userToNotify);
      } catch (e) {
        return res.status(400).json({ error: e });
      }
    }

    // return same as in loadSubproblemAttempt

    return res.status(200).json({});
  });
};

const sendBackAnswers = async (req: TypedRequestBody<subproblemAttemptRequestBodyType>, res) => {
  const subproblemAttempt = await SubproblemAttemptModel.findById(req.body.subproblemAttemptId);
  if (!subproblemAttempt) {
    // should not happen
    return res.status(404).json({ error: "No subproblem attempt found" });
  }
  const user = (await UserModel.findById(subproblemAttempt.assignedUser)) as User;
  try {
    await alertSendback(user);
    return res.status(200).json({});
  } catch (e) {
    return res.status(400).json({ error: e });
  }
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
    }).populate({ path: "subproblemAttempts", populate: { path: "assignedUser" } });
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

  console.log("problem attempts", problemAttempt);

  if (!subproblem) {
    return res.status(200).json({
      data: null,
    });
  }

  return res.status(200).json({
    data: {
      mySubproblemIndex: subproblem.index,
      subproblemData: {
        question: subproblem.question,
        category: subproblem.category,
      },
      subproblemAttempts:
        problemAttempt.subproblemAttempts.map((attempt) => ({
          _id: attempt._id,
          assignedUser: {
            name: attempt.assignedUser.name,
            email: attempt.assignedUser.email,
            _id: attempt.assignedUser._id,
            isAdmin: attempt.assignedUser.isAdmin,
          },
          answer: attempt.answer,
        })) ?? [],
    },
  });
};

const loadRandomSubproblem = async (req: TypedRequestQuery<{}>, res) => {
  const revealedProblems = await RelayProblemModel.aggregate([
    { $match: { status: ProblemStatus.Revealed } },
    { $sample: { size: 1 } },
  ]);
  if (revealedProblems.length === 0) {
    return res.status(200).json({
      subproblemData: null,
    });
  }

  const relayProblem = await RelayProblemModel.findById(revealedProblems[0]._id).populate<{
    subproblems: Subproblem[];
  }>("subproblems");
  if (!relayProblem) {
    throw new Error("should not happen");
  }

  const randomSubproblemIndex = Math.floor(Math.random() * relayProblem.subproblems.length);

  return res.status(200).json({
    subproblemData: {
      question: relayProblem.subproblems[randomSubproblemIndex].question,
      category: relayProblem.subproblems[randomSubproblemIndex].category,
      previousAnswer:
        randomSubproblemIndex == 0
          ? undefined
          : relayProblem.subproblems[randomSubproblemIndex - 1].answer,
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
  sendBackAnswers,
  loadSubproblemAttempt,
  loadRandomSubproblem,
  loadProblemResults,
};
