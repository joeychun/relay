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
} from "../server/models/Problem";
import { Team } from "../server/models/Team";

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
