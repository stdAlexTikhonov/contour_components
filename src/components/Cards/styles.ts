import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
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
