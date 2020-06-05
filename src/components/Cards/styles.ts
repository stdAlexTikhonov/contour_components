import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  box: {
    minWidth: 275,
    position: "relative",
    paddingRight: 15,
    height: "100%",
  },
  container: {
    backgroundColor: "#f5f5f5",
    height: "80vh",
    width: "80%",
    margin: "auto",
    overflow: "scroll",
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
