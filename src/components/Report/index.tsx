import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import { AppState } from "../../store/config_store";

interface Props {}

type IProps = Props & LinkStateToProps;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 5,
    position: "relative",
    paddingRight: 15,
  },
  container: {
    display: "flex",
    backgroundColor: "#cfe8fc",
    height: "100vh",
    paddingTop: "100px",
    flexWrap: "wrap",
    alignItems: "flex-start",
    overflow: "scroll",
    justifyContent: "space-around",
    cursor: "pointer",
  },
  icon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
});

const CardsComponent: React.FC<IProps> = ({ items, session, language }) => {
  const { solution, folder, project, p_folder } = useParams();

  return <div style={{ paddingTop: 70 }}>This is report</div>;
};

interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
}

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const Report = connect(mapStateToProps)(CardsComponent);
