import React from "react";

interface IProps {
  name: string;
}

export const App: React.FC<IProps> = (props) => {
  return <div> {props.name + " " + process.env.REACT_APP_BI_URL} </div>;
};

export default App;
