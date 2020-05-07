import React, { useEffect } from "react";
import { ButtonAppBar } from "../Navabar";
import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
import { LoaderComponent } from "../Loader/index";

interface IProps {
  name: string;
  dispatch: any;
}

export const App: React.FC<IProps> = (props) => {
  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [props]);
  return (
    <div>
      <LoaderComponent />
      <ButtonAppBar />
      {props.name + " " + process.env.REACT_APP_BI_URL}
    </div>
  );
};

export default connect()(App);
