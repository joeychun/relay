import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
  User,
  addProblemRequestBodyType,
  createTeamRequestBodyType,
  getMyUser,
  getTeamWithUsers,
  getUserActiveOrRecruitingTeam,
  getUserTeams,
  joinTeamRequestBodyType,
  lock,
  setUserNameRequestBodyType,
  submitSubproblemAttemptRequestBodyType,
  subproblemAttemptResponseType,
  teamRequestBodyType,
} from "../../shared/apiTypes";

import { TypedRequestBody } from "../../shared/apiTypes";
import socketManager from "../server-socket";
import mongoose, { Types, UpdateWriteOpResult } from "mongoose";
import { Team, TeamModel, TeamStatus } from "../models/Team";
import { ProblemStatus, RelayProblemAttemptModel, RelayProblemModel } from "../models/Problem";
import { createRelayProblemAttempt } from "./adminCalls";

const getCurrentUserTeam = async (
  req: TypedRequestBody<{}>,
  res // teamResponseType
) => {
  // return the active or recruiting team
  const myUserId: string = req.user?._id as string;
  const team = await getUserActiveOrRecruitingTeam(myUserId);
  return res.status(200).json({ team });
};

const loadMyUser = async (
  req: TypedRequestBody<{}>,
  res // User
) => {
  const myUserId: string = req.user?._id as string;

  const user = await getMyUser(myUserId);
  res.status(200).json({ user });
};

const setUserName = async (
  req: TypedRequestBody<setUserNameRequestBodyType>,
  res // User
) => {
  const myUserId: string = req.user?._id as string;

  const user = await getMyUser(myUserId);
  if (req.body.name.length == 0) {
    throw new Error("username must be at least 1 character.");
  }
  user.name = req.body.name;
  const savedUser = await user.save();
  res.status(200).json({ user: savedUser });
};

function generateRandomCode() {
  const randomCode = Math.floor(Math.random() * 9000) + 1000;
  return randomCode.toString();
}

const createTeam = async (
  req: TypedRequestBody<createTeamRequestBodyType>,
  res // teamResponseType
) => {
  const myUserId: string = req.user?._id as string;

  const activeTeam = await getUserActiveOrRecruitingTeam(myUserId);
  if (!!activeTeam) {
    throw new Error("Already have an active or recruiting team.");
  }

  await lock.acquire([myUserId], async () => {
    // Create a new converted game with the player who joined
    const newTeam = new TeamModel({
      name: req.body.name,
      code: generateRandomCode(),
    });
    newTeam.users.push(new Types.ObjectId(myUserId));
    const savedTeam = await newTeam.save();
    console.log(`Team with id ${savedTeam._id} created`);
    res.status(200).json({ team: savedTeam });
  });
};

const joinTeam = async (req: TypedRequestBody<joinTeamRequestBodyType>, res) => {
  const myUserId: string = req.user?._id as string;
  const team = await TeamModel.findOne({ code: req.body.code }).populate<{
    users: User[];
  }>("users");
  if (!team) {
    throw new Error(`Team with code ${req.body.code} not found`);
  }
  // too full
  // FOR NOW, EACH TEAM MUST HAVE THREE PEOPLE
  if (team.users.length == 3) {
    throw new Error("Team is full already.");
  }
  // not in recruiting stage
  if (team.status != TeamStatus.Recruiting) {
    throw new Error("Team is not accepting new members.");
  }

  // already has a team
  const activeTeam = await getUserActiveOrRecruitingTeam(myUserId);
  if (!!activeTeam) {
    throw new Error("Already have an active or recruiting team.");
  }

  const myUser = await getMyUser(myUserId);

  team.users.push(myUser);
  const savedTeam = await team.save();
  if (savedTeam.users.length == NUM_PROBLEMS) {
    // activate and creates a new problem for the current problem
    await activateTeam(savedTeam._id);
  }

  console.log(`Team with id ${savedTeam._id} joined`);
  res.status(200).json({ team: savedTeam });
};

async function activateTeam(teamId: string) {
  // change team status
  // create a new relay problem attempt for current active problem
  const team = await getTeamWithUsers(teamId);
  if (team.users.length != 3) {
    throw new Error("Need three people on a team.");
  }

  // not in recruiting stage
  if (team.status != TeamStatus.Recruiting) {
    throw new Error("Team has already been published.");
  }

  team.status = TeamStatus.Active;
  team.dateStarted = new Date();
  const savedTeam = await team.save();
  console.log(`Team with id ${savedTeam._id} activated`);

  // create new problem attempt for active team if problem exists
  const activeProblem = await RelayProblemModel.findOne({
    status: ProblemStatus.Active,
  });
  if (!!activeProblem) {
    await createRelayProblemAttempt(teamId, activeProblem._id);
  }
}

const endTeam = async (
  req: TypedRequestBody<teamRequestBodyType>,
  res // teamResponseType
) => {
  // Don't expose this feature yet on the FE
  const myUserId: string = req.user?._id as string;
  const team = await getTeamWithUsers(req.body.teamId);
  if (team.status == TeamStatus.Ended) {
    throw new Error("Team has already been ended.");
  }
  team.dateEnded = new Date();
  team.status = TeamStatus.Ended;
  const savedTeam = await team.save();
  return res.status(200).json({ savedTeam });
};

const loadUserTeams = async (
  req: TypedRequestBody<{}>,
  res // getUserTeamsResponseType
) => {
  const myUserId: string = req.user?._id as string;
  const teams = await getUserTeams(myUserId);
  return res.status(200).json({ teams });
};

const getTeamInfo = async (
  req: TypedRequestBody<teamRequestBodyType>,
  res // teamResponseType
) => {
  const myUserId: string = req.user?._id as string;
  const team = await getTeamWithUsers(req.body.teamId);
  return res.status(200).json({ team });
};

export default {
  loadMyUser,
  setUserName,
  getCurrentUserTeam,
  createTeam,
  joinTeam,
  endTeam,
  loadUserTeams,
  getTeamInfo,
};
