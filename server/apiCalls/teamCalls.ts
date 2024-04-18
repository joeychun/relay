import UserModel from "../models/User";

import {
  User,
  addProblemRequestBodyType,
  createTeamRequestBodyType,
  getMyUser,
  getTeamWithUsers,
  getUserActiveOrRecruitingTeam,
  getUserTeams,
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
import {
  ProblemStatus,
  RelayProblemAttemptModel,
  RelayProblemModel,
} from "../models/Problem";

const getCurrentUserTeam = async (
  req: TypedRequestBody<{}>,
  res // teamResponseType
) => {
  // return the active or recruiting team
  const myUserId: string = req.user?._id as string;
  const team = await getUserActiveOrRecruitingTeam(myUserId);
  return res.status(200).json({ team });
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
    });
    newTeam.users.push(new Types.ObjectId(myUserId));
    const savedTeam = await newTeam.save();
    console.log(`Team with id ${savedTeam._id} created`);
    res.status(200).json({ team: savedTeam });
  });
};

const joinTeam = async (req: TypedRequestBody<teamRequestBodyType>, res) => {
  const myUserId: string = req.user?._id as string;
  const team = await getTeamWithUsers(req.body.teamId);
  if (!team) {
    console.log(`Team with id ${req.body.teamId} not found`);
    res.status(404).json("Team not found");
    return;
  }
  // too full
  // FOR NOW, EACH TEAM MUST HAVE THREE PEOPLE
  if (team.users.length == 3) {
    throw new Error("Team is full already.");
  }

  // not in recruiting stage
  if (team.status != TeamStatus.Recruiting) {
    throw new Error("Team is not recruiting.");
  }

  // already has a team
  const activeTeam = await getUserActiveOrRecruitingTeam(myUserId);
  if (!!activeTeam) {
    throw new Error("Already have an active or recruiting team.");
  }

  const myUser = await getMyUser(myUserId);

  team.users.push(myUser);
  const savedTeam = await team.save();
  console.log(`Team with id ${savedTeam._id} joined`);
  res.status(200).json({ team: savedTeam });
};

const publishTeam = async (
  req: TypedRequestBody<teamRequestBodyType>,
  res // teamResponseType
) => {
  const myUserId: string = req.user?._id as string;

  const team = await getTeamWithUsers(req.body.teamId);
  // TODO: on the FE, don't show publish button if not at least two users
  // too full
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
  console.log(`Team with id ${savedTeam._id} joined`);
  res.status(200).json({ team: savedTeam });
};

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
  setUserName,
  getCurrentUserTeam,
  createTeam,
  publishTeam,
  joinTeam,
  endTeam,
  loadUserTeams,
  getTeamInfo,
};
