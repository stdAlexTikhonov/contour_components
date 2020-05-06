import React from "react";
import { ButtonAppBar } from "../Navabar";

interface IProps {
  name: string;
}

export const App: React.FC<IProps> = (props) => {
  return (
    <div>
      <ButtonAppBar />
      {props.name + " " + process.env.REACT_APP_BI_URL}
    </div>
  );
};

export default App;
