import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import teamCalls from "./apiCalls/teamCalls";
import problemCalls from "./apiCalls/problemCalls";
import adminCalls from "./apiCalls/adminCalls";
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get(`/user`, teamCalls.loadMyUser);
router.post(`/username`, teamCalls.setUserName);

// team creation
router.post(`/createTeam`, teamCalls.createTeam);
router.post(`/joinTeam`, teamCalls.joinTeam);
router.get(`/team`, teamCalls.getCurrentUserTeam);
router.post(`/setTeamName`, teamCalls.setTeamName);

// problem
router.get(`/subproblemAttempt`, problemCalls.loadSubproblemAttempt);
router.get(`/randomSubproblem`, problemCalls.loadRandomSubproblem);
router.post(`/submitAnswer`, problemCalls.submitSubproblemAttempt);

// admin
router.get(`/admin/recentProblems`, adminCalls.loadRecentProblems);
router.post(`/admin/publishProblem`, adminCalls.publishProblem);
router.post(`/admin/releaseAnswer`, adminCalls.releaseAnswer);
router.post(`/admin/createProblem`, adminCalls.createProblem);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
