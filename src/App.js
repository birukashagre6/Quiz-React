import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

function reducer(state, action) {
  switch (action.type) {
    case "RecievedData":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "FailedData":
      return { ...state, status: "error" };
    case "Start":
      return { ...state, status: "active" };
    default:
      throw new Error("Unkown Error");
  }
}

export default function App() {
  const initialState = {
    questions: [],
    status: "loading",
  };
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "RecievedData", payload: data }))
      .catch((err) => dispatch({ type: "FailedData" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && <Question />}
      </Main>
    </div>
  );
}
