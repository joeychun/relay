import React, { useEffect, useState } from "react";
import {
  NUM_PROBLEMS,
  QuestionData,
  RelayProblem,
  RelayProblemWithSubproblems,
  UserInfo,
  addProblemRequestBodyType,
  problemResponseType,
  recentProblemResponseType,
  updateProblemStatusRequestBodyType,
  userDataResponseType,
} from "../../../../shared/apiTypes";
import { get, post } from "../../utilities";
import { CircularProgress } from "@mui/material";
import { ProblemStatus } from "../../../../server/models/Problem";

type AdminPageProps = {
  userId?: string;
};

const AdminPage = (props: AdminPageProps) => {
  const userId = props.userId;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentProblems, setRecentProblems] = useState<RelayProblemWithSubproblems[]>([]);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadUser = () => {
    if (!userId) {
      console.log("No user id to load");
      return Promise.resolve();
    }
    get(`/api/user`, {}).then((res: userDataResponseType) => {
      console.log("res", res);
      setUserInfo(res.data);
    });
  };

  const loadRecentQuestions = () => {
    if (!userId) {
      console.log("No user id to load");
      return Promise.resolve();
    }
    get(`/api/admin/recentProblems`, {}).then((res: recentProblemResponseType) => {
      console.log("res", res);
      setRecentProblems(res.problems);
    });
  };

  const handlePublish = (problemId: string) => {
    // Handle publish action
    console.log("Publish question:", problemId);
    if (!problemId || !userId) return Promise.resolve();
    const body: updateProblemStatusRequestBodyType = {
      problemId,
    };
    return post("/api/admin/publishProblem", body)
      .then((res: recentProblemResponseType) => {
        setMsg(`Published question with id ${problemId}`);
        setRecentProblems(res.problems);
      })
      .catch((e) => {
        setErrorMsg(`Something went wrong while publishing ${e}.`);
      });
  };

  const handleReleaseAnswer = (problemId: string) => {
    // Handle release answer action
    console.log("Release answer for question:", problemId);
    // TODO: finish hooking up
    // if (!problemId || !userId) return Promise.resolve();
    // const body: updateProblemStatusRequestBodyType = {
    //   problemId,
    // };
    // return post("/api/admin/releaseAnswer", body)
    //   .then((res: recentProblemResponseType) => {
    //     setMsg(`Released answers for question with id ${problemId}`);
    //     setRecentProblems(res.problems);
    //   })
    //   .catch((e) => {
    //     setErrorMsg(`Something went wrong while releasing answers ${e}.`);
    //   });
  };

  const handleCreateProblem = (questionData: QuestionData[], date: Date) => {
    // Handle create action
    if (!userId) return Promise.resolve();
    // TODO: LATER - add input for category
    const body: addProblemRequestBodyType = {
      questionsWithAnswers: questionData,
      date,
    };
    return post("/api/admin/createProblem", body)
      .then((res: recentProblemResponseType) => {
        setMsg(`Created question`);
        setRecentProblems(res.problems);
      })
      .catch((e) => {
        setErrorMsg(`Something went wrong while creating ${e}.`);
      });
  };

  useEffect(() => {
    try {
      loadUser();
      loadRecentQuestions();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]);

  if (!userId) {
    window.location.href = "/login";
  }

  if (!userInfo) {
    return <CircularProgress />;
  }
  if (!userInfo.isAdmin) {
    window.location.href = "/problem";
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <QuestionForm handleCreateProblem={handleCreateProblem} />
      <RecentQuestions
        problems={recentProblems}
        handlePublish={handlePublish}
        handleReleaseAnswer={handleReleaseAnswer}
      />
      {!!msg && <label>Update: {msg}</label>}
      {!!errorMsg && <label>ERROR: {errorMsg}</label>}
    </div>
  );
};

type QuestionFormProps = {
  handleCreateProblem: (questionData: QuestionData[], date: Date) => void;
};

const QuestionForm = (props: QuestionFormProps) => {
  // TODO: switch back when ready, temp make questions of length 2
  // const [questions, setQuestions] = useState([
  //   { question: "", answer: "", image: null },
  //   { question: "", answer: "", image: null },
  //   { question: "", answer: "", image: null },
  // ]);

  const [questions, setQuestions] = useState<QuestionData[]>([
    { question: "", answer: "", image: null },
    { question: "", answer: "", image: null },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleImageChange = (index, file) => {
    const newQuestions = [...questions];
    newQuestions[index].image = file;
    setQuestions(newQuestions);
  };

  const areQuestionsValid = () => {
    return questions.every(
      (question) => question.question.length > 0 && question.answer.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    if (!selectedDate || !areQuestionsValid()) {
      return;
    }
    console.log("Submitting:", { questions, selectedDate });

    props.handleCreateProblem(questions, selectedDate);

    // Reset form fields
    // setQuestions([
    //   { question: "", answer: "", image: null },
    //   { question: "", answer: "", image: null },
    //   { question: "", answer: "", image: null },
    // ]);
    setQuestions([
      { question: "", answer: "", image: null },
      { question: "", answer: "", image: null },
    ]);
    setSelectedDate(null);
  };

  console.log("questions", questions);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setSelectedDate(new Date(dateValue));
  };

  return (
    <div>
      <h2>Add New Questions</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((questionObj, index) => (
          <div key={index}>
            <label>
              Question {index + 1}:
              <input
                type="text"
                value={questionObj.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                required
              />
            </label>
            <label>
              Answer {index + 1}:
              <input
                type="text"
                value={questionObj.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
              />
            </label>
            <label>
              Add File:
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.gif"
                onChange={(e) => {
                  if (!e.target.files) return;
                  handleImageChange(index, e.target.files[0]);
                }}
              />
            </label>
          </div>
        ))}
        <label>
          Date:
          <input
            type="date"
            value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
            onChange={handleDateChange}
            required
          />
        </label>
        <button type="submit" disabled={!selectedDate || !areQuestionsValid()}>
          Add Questions
        </button>
      </form>
    </div>
  );
};

type RecentQuestionsProps = {
  problems: RelayProblemWithSubproblems[];
  handlePublish: (problemId: string) => void;
  handleReleaseAnswer: (problemId: string) => void;
};

const RecentQuestions = (props: RecentQuestionsProps) => {
  const { problems, handlePublish, handleReleaseAnswer } = props;

  return (
    <div>
      <h2>Recent Questions</h2>
      <ul>
        {problems.map((relayProblem) => (
          <li key={relayProblem._id}>
            <ul>
              {relayProblem.subproblems.map((subproblem) => (
                <li key={subproblem._id}>
                  Question: {subproblem.question}
                  <br />
                  Answer: {subproblem.answer}
                </li>
              ))}
            </ul>
            <label>Id: {relayProblem._id}</label>
            <br />
            <label>Status: {relayProblem.status}</label>
            <br />
            <label>Date: {relayProblem.date}</label>
            <br />
            <button
              onClick={() => handlePublish(relayProblem._id)}
              disabled={relayProblem.status != ProblemStatus.Pending}
            >
              Publish
            </button>
            <button
              onClick={() => handleReleaseAnswer(relayProblem._id)}
              disabled={relayProblem.status != ProblemStatus.Active}
            >
              Release Answer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;

const questions = [
  // For now, examples
  { id: 1, text: "What is $2+2$?", date: "2024-04-21" },
  { id: 2, text: "What is $2+3$?", date: "2024-04-21" },
  { id: 3, text: "What is $2+4$?", date: "2024-04-21" },
];
