import React from "react";

interface IProps {
  name: string;
}

function App(props: IProps) {
  return <div> {props.name + " " + process.env.REACT_APP_BI_URL} </div>;
}

export default App;
