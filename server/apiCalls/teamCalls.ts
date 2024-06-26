import UserModel from "../models/User";

import {
  NUM_PROBLEMS,
  TypedRequestQuery,
  User,
  addProblemRequestBodyType,
  createTeamRequestBodyType,
  getMyUser,
  getTeamWithUsers,
  getUserActiveOrRecruitingTeam,
  getUserTeams,
  joinTeamRequestBodyType,
  lock,
  setTeamNameRequestBodyType,
  setUserNameRequestBodyType,
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
  SubproblemAttempt,
} from "../models/Problem";
import { createRelayProblemAttempt } from "./adminCalls";

function formatTeamWithInfo(teamWithUsers) {
  return {
    teamInfo: {
      _id: teamWithUsers._id,
      name: teamWithUsers.name,
      dateStarted: teamWithUsers.dateStarted,
      dateEnded: teamWithUsers.dateEnded,
      users: teamWithUsers.users.map((u) => ({
        name: u.name,
        email: u.email,
        _id: u._id,
        isAdmin: u.isAdmin,
      })),
      status: teamWithUsers.status,
      code: teamWithUsers.code,
      longestStreak: teamWithUsers.longestStreak,
      currentStreak: teamWithUsers.currentStreak,
    },
  };
}

const getCurrentUserTeam = async (
  req: TypedRequestQuery<{}>,
  res // TeamWithInfo
) => {
  // return the active or recruiting team
  const myUserId: string = req.user?._id as string;
  const team = await getUserActiveOrRecruitingTeam(myUserId);
  if (!team) {
    return res.status(200).json({ teamInfo: null });
  }
  const teamWithUsers = await getTeamWithUsers(team._id);
  const formattedTeamInfo = formatTeamWithInfo(teamWithUsers);

  if (teamWithUsers.status != TeamStatus.Active) {
    return res.status(200).json(formattedTeamInfo);
  }
  // Team is active, also return recent problems
  const mostRecentAttempts = (await RelayProblemAttemptModel.find({ team: team._id }) // Filter by team
    .sort({ createdAt: -1 }) // Sort in descending order based on creation time
    .populate({
      path: "problem", // Populate the 'problem' field
      select: ["date", "status"], // Select specific fields from the 'problem' document
    })
    .limit(6) // Limit the results to 6 documents, since one might be active and we want to return 5
    .populate({
      path: "subproblemAttempts", // Populate the 'subproblemAttempts' field
      populate: [
        { path: "assignedUser" }, // Populate the 'assignedUser' field within each 'SubproblemAttempt'
        { path: "subproblem" }, // Populate the 'subproblem' field within each 'SubproblemAttempt'
      ],
    })) as any[];

  const recentProblemData = mostRecentAttempts
    .filter((ra) => ra.problem.status != ProblemStatus.Active)
    .slice(0, 5)
    .map((ra) => ({
      subproblems: ra.subproblemAttempts.map((sa) => sa.subproblem),
      status: ra.problem.status,
      date: ra.problem.date,
      subproblemAttemptsWithUsers: ra.subproblemAttempts.map((sa) => ({
        _id: sa._id,
        assignedUser: {
          name: sa.assignedUser.name,
          email: sa.assignedUser.email,
          _id: sa.assignedUser._id,
          isAdmin: sa.assignedUser.isAdmin,
        },
        answer: sa.answer,
      })),
    }));

  return res
    .status(200)
    .json({ teamInfo: formattedTeamInfo.teamInfo, recentProblems: recentProblemData });
};

const loadMyUser = async (
  req: TypedRequestQuery<{}>,
  res // User
) => {
  const myUserId: string = req.user?._id as string;

  const user = await getMyUser(myUserId);
  res
    .status(200)
    .json({ data: { name: user.name, email: user.email, _id: user._id, isAdmin: user.isAdmin } });
};

const setUserName = async (
  req: TypedRequestBody<setUserNameRequestBodyType>,
  res // User
) => {
  const myUserId: string = req.user?._id as string;

  const user = await getMyUser(myUserId);
  if (req.body.name.length == 0) {
    return res.status(400).json({ error: "Username must be at least 1 character." });
  }
  user.name = req.body.name;
  const savedUser = await user.save();
  res.status(200).json({});
};

const setTeamName = async (
  req: TypedRequestBody<setTeamNameRequestBodyType>,
  res // Team
) => {
  const myUserId: string = req.user?._id as string;

  // const user = await getMyUser(myUserId);
  if (req.body.name.length == 0) {
    return res.status(400).json({ error: "Team name must be at least 1 character." });
  }
  const team = await getTeamWithUsers(req.body.teamId);

  if (!team) {
    return res.status(404).json({ error: "Team not found" });
  }
  team.name = req.body.name;
  const savedTeam = await team.save();
  res.status(200).json({});
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
    return res.status(400).json({ error: "Already have an active or recruiting team." });
  }

  await lock.acquire([myUserId], async () => {
    // Create a new converted game with the player who joined
    let code;
    let teamWithCode;

    do {
      code = generateRandomCode(); // Generate a new code
      teamWithCode = await TeamModel.findOne({ code }); // Check if the code already exists
    } while (teamWithCode);

    const newTeam = new TeamModel({
      name: req.body.name,
      code: code,
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
    return res.status(404).json({ error: `Team with code ${req.body.code} not found` });
  }
  // too full
  // FOR NOW, EACH TEAM MUST HAVE THREE PEOPLE
  if (team.users.length == NUM_PROBLEMS) {
    return res.status(403).json({ error: "Team is full already." });
  }
  // not in recruiting stage
  if (team.status != TeamStatus.Recruiting) {
    return res.status(403).json({ error: "Team is not accepting new members." });
  }

  // already has a team
  const activeTeam = await getUserActiveOrRecruitingTeam(myUserId);
  if (!!activeTeam) {
    return res.status(403).json({ error: "Already have an active or recruiting team." });
  }

  const myUser = await getMyUser(myUserId);

  team.users.push(myUser);
  const savedTeam = await team.save();
  if (savedTeam.users.length == NUM_PROBLEMS) {
    // activate and creates a new problem for the current problem
    try {
      await activateTeam(savedTeam._id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }

  console.log(`Team with id ${savedTeam._id} joined`);
  res.status(200).json({ team: savedTeam });
};

async function activateTeam(teamId: string) {
  // change team status
  // create a new relay problem attempt for current active problem
  const team = await getTeamWithUsers(teamId);
  if (team.users.length != NUM_PROBLEMS) {
    throw new Error(`Need ${NUM_PROBLEMS} people on a team.`);
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
    return res.status(400).json({ error: "Team has already been ended." });
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
  req: TypedRequestQuery<teamRequestBodyType>,
  res // teamResponseType
) => {
  const myUserId: string = req.user?._id as string;
  const team = await getTeamWithUsers(req.query.teamId);
  return res.status(200).json({ team });
};

export default {
  loadMyUser,
  setUserName,
  setTeamName,
  getCurrentUserTeam,
  createTeam,
  joinTeam,
  endTeam,
  loadUserTeams,
  getTeamInfo,
};
