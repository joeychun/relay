// home icon on sidebar should go to /lobby if you don't have a team, and team-recruit if you do and it's recruiting, and /team if you do and it's active

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  NUM_PROBLEMS,
  RelayProblemResult,
  Team,
  TeamWithInfo,
  setTeamNameRequestBodyType,
  teamResponseType,
  teamWithInfoResponseType,
} from "../../../../shared/apiTypes";
import { TeamStatus } from "../../../../server/models/Team";
import { get } from "../../utilities";


type IndexPageProps = {
  userId?: string;
};

const IndexPage = (props: IndexPageProps) => {
  const userId = props.userId;
  const [teamInfo, setTeamInfo] = useState<TeamWithInfo | null>(null);
  const [teamIsLoaded, setTeamIsLoaded] = useState<boolean>(false);

  // load current team
  const loadTeamData = () => {
    if (!!userId) {
      get(`/api/team`, {})
        .then((res: teamWithInfoResponseType) => {
          setTeamInfo(res.teamInfo);
          setTeamIsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
        });
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [userId]);

  if (!teamIsLoaded) {
    return <></>;
  } else {
    if (!teamInfo) {
      return <Navigate to="/lobby" />;
    }
    if (teamInfo.status === TeamStatus.Recruiting) {
      return <Navigate to="/team-recruit" />
    }
    return <Navigate to="/problem" /> // else: Active Team
  }

};

export default IndexPage;