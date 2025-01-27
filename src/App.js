import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";

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
    default:
      throw new Error("Unkown Error");
  }
}

export default function App() {
  const initialState = {
    questions: [],
    status: "loading",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

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
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
      </Main>
    </div>
  );
}
