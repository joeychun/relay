import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
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

async function assignRandomNextUser(parentProblemAttemptId: string) {
  const parentProblemAttempt = await RelayProblemAttemptModel.findById(
    parentProblemAttemptId
  ).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
  if (!parentProblemAttempt) {
    throw new Error("no parent");
  }
  const prevUsers = parentProblemAttempt.subproblemAttempts.map((attempt) =>
    attempt.assignedUser._id.toString()
  );

  const team = await TeamModel.findById(parentProblemAttempt.team).populate<{
    users: User[];
  }>("users");
  if (!team) {
    throw new Error("Team not found");
  }
  const teamUsers = team.users.map((user) => user._id.toString());

  // if everyone has been chosen

  const availableUsers = teamUsers.filter((user) => !prevUsers.includes(user));

  if (availableUsers.length == 0) {
    // shouldn't happen
    throw new Error("all users are taken");
  }
  // Select a random user from the available users
  const randomIndex = Math.floor(Math.random() * availableUsers.length);
  const randomlySelectedUser = availableUsers[randomIndex];
  console.log("Randomly selected user:", randomlySelectedUser);
  return randomlySelectedUser;
}

export async function createSubproblemAttempt(relayProblemAttemptId: string) {
  const parentProblemAttempt = await RelayProblemAttemptModel.findById(
    relayProblemAttemptId
  ).populate<{ subproblemAttempts: SubproblemAttempt[] }>("subproblemAttempts");
  if (!parentProblemAttempt) {
    // should not happen
    throw new Error("no parent problem found");
  }
  if (parentProblemAttempt.subproblemAttempts.length == 3) {
    throw new Error("should not be creating a new subproblem attempt");
  }

  const parentRelayProblem = await RelayProblemModel.findById(
    parentProblemAttempt.problem
  ).populate<{ subproblems: Subproblem[] }>("subproblems");

  if (!parentRelayProblem) {
    // should not happen
    throw new Error("no parent problem found");
  }

  const nextUser = await assignRandomNextUser(relayProblemAttemptId);
  const nextSubproblemAttempt = new SubproblemAttemptModel({
    parentProblemAttempt: relayProblemAttemptId,
    subproblem:
      parentRelayProblem.subproblems[
      parentProblemAttempt.subproblemAttempts.length
      ],
    assignedUser: nextUser, // randomly pick user
  });
  const savedSubproblemAttempt = await nextSubproblemAttempt.save();
  console.log("Added new subproblem attempt");
  parentProblemAttempt.subproblemAttempts.push(savedSubproblemAttempt);
  await parentProblemAttempt.save();
  return savedSubproblemAttempt;
}

const submitSubproblemAttempt = async (
  req: TypedRequestBody<submitSubproblemAttemptRequestBodyType>,
  res // subproblemAttemptResponseType
) => {
  const myUserId: string = req.user?._id as string;
  const subproblemAttempt = await SubproblemAttemptModel.findById(
    req.body.subproblemAttemptId
  );
  if (!subproblemAttempt) {
    throw new Error("No subproblem attempt found.");
  }
  if (subproblemAttempt.assignedUser._id.toString() != myUserId) {
    throw new Error("This problem has not been assigned to you.");
  }
  const subproblem = (await SubproblemModel.findById(
    subproblemAttempt.subproblem
  )) as Subproblem;
  // TODO: will this lock create an issue?
  await lock.acquire([subproblemAttempt?.parentProblemAttempt], async () => {
    subproblemAttempt.answer = req.body.answer.trim();
    const savedAttempt = await subproblemAttempt.save();

    // get parent problem
    const parentProblemAttempt = await RelayProblemAttemptModel.findById(
      subproblemAttempt.parentProblemAttempt
    ).populate<{ subproblemAttempts: SubproblemAttempt[] }>(
      "subproblemAttempts"
    );
    if (!parentProblemAttempt) {
      // should not happen
      throw new Error("no parent problem found");
    }

    const parentRelayProblem = await RelayProblemModel.findById(
      parentProblemAttempt.problem
    ).populate<{ subproblems: Subproblem[] }>("subproblems");
    if (!parentRelayProblem) {
      // should not happen
      throw new Error("no parent problem found");
    }

    // TODO: LATER EXTENSION - show progress of where your teammates are.
    // Only create new if my submission is the latest subproblem
    if (
      parentProblemAttempt.subproblemAttempts.length < NUM_PROBLEMS &&
      parentProblemAttempt.subproblemAttempts[
        parentProblemAttempt.subproblemAttempts.length - 1
      ]._id == subproblemAttempt._id
    ) {
      // TODO: notify the next user
      const newSubproblem = await createSubproblemAttempt(
        parentProblemAttempt._id
      );
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
  req: TypedRequestBody<{}>,
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
  const activeProblem = await RelayProblemModel.findOne({
    status: ProblemStatus.Active,
  });
  const myTeam = await getUserActiveTeam(myUserId);

  if (!!activeProblem && !!myTeam) {
    const problemAttempt = await RelayProblemAttemptModel.findOne({
      problem: activeProblem,
      team: myTeam,
    });
    if (!!problemAttempt) {
      subproblemAttempt = await SubproblemAttemptModel.findOne({
        parentProblemAttempt: problemAttempt,
        assignedUser: myUserId,
      });
      subproblem = await SubproblemModel.findById(subproblemAttempt.subproblem);
    }
  }
  return res.status(200).json({
    subproblemAttempt,
    subproblemData: {
      question: subproblem?.question,
      category: subproblem?.category,
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
  loadProblemResults,
};
