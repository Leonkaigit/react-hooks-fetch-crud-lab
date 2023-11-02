import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions: ", error));
  };

  const handleNewQuestionSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then(() => {
        // Clear the form fields
        setNewQuestion({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });

        // Fetch questions to update the list
        fetchQuestions();
      })
      .catch((error) => console.error("Error creating a new question: ", error));
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            fetchQuestions={fetchQuestions} // Pass the fetchQuestions function
          />
        ))}
      </ul>

      {/* Form for creating a new question */}
      <form onSubmit={handleNewQuestionSubmit}>
        <input
          type="text"
          placeholder="Question prompt"
          value={newQuestion.prompt}
          onChange={(e) => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
        />
        {newQuestion.answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Answer ${index + 1}`}
            value={answer}
            onChange={(e) => {
              const newAnswers = [...newQuestion.answers];
              newAnswers[index] = e.target.value;
              setNewQuestion({ ...newQuestion, answers: newAnswers });
            }}
          />
        ))}
        <select
          value={newQuestion.correctIndex}
          onChange={(e) => setNewQuestion({ ...newQuestion, correctIndex: e.target.value })}
        >
          {newQuestion.answers.map((_, index) => (
            <option key={index} value={index}>
              Correct Answer {index + 1}
            </option>
          ))}
        </select>
        <button type="submit">New Question</button>
      </form>
    </section>
  );
}

export default QuestionList;
