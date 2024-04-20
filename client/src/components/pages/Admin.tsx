import React, { useState } from 'react';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <QuestionForm />
      <RecentQuestions />
    </div>
  );
};

const QuestionForm = () => {
  const [questions, setQuestions] = useState([
    { question: '', answer: '', image: null },
    { question: '', answer: '', image: null },
    { question: '', answer: '', image: null },
  ]);
  const [date, setDate] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log('Submitted:', { questions, date });
    // Reset form fields
    setQuestions([
      { question: '', answer: '', image: null },
      { question: '', answer: '', image: null },
      { question: '', answer: '', image: null },
    ]);
    setDate('');
  };

  return (
    <div>
      <h2>Add New Questions</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((questionObj, index) => (
          <div key={index}>
            <label>
              Question {index + 1}:
              <input type="text" value={questionObj.question} onChange={(e) => handleQuestionChange(index, e.target.value)} required />
            </label>
            <label>
              Answer {index + 1}:
              <input type="text" value={questionObj.answer} onChange={(e) => handleAnswerChange(index, e.target.value)} required />
            </label>
            <label>
              Add File:
              <input type="file" accept=".png,.jpg,.jpeg,.svg,.gif" onChange={(e) => {
                if (!e.target.files) return;
                handleImageChange(index, e.target.files[0])
              }} />
            </label>
          </div>
        ))}
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <button type="submit">Add Questions</button>
      </form>
    </div>
  );
};

const RecentQuestions = () => {
  const questions = [ // For now, examples.
    { id: 1, text: "What is $2+2$?", date: "2024-04-21" },
    { id: 2, text: "What is $2+3$?", date: "2024-04-21" },
    { id: 3, text: "What is $2+4$?", date: "2024-04-21" },
  ]

  const handlePublish = (questionId) => {
    // Handle publish action
    console.log('Publish question:', questionId);
  };

  const handleReleaseAnswer = (questionId) => {
    // Handle release answer action
    console.log('Release answer for question:', questionId);
  };

  return (
    <div>
      <h2>Recent Questions</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.text} - {question.date}
            <button onClick={() => handlePublish(question.id)}>Publish</button>
            <button onClick={() => handleReleaseAnswer(question.id)}>Release Answer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;


const questions = [ // For now, examples
  { id: 1, text: "What is $2+2$?", date: "2024-04-21" },
  { id: 2, text: "What is $2+3$?", date: "2024-04-21" },
  { id: 3, text: "What is $2+4$?", date: "2024-04-21" },
]