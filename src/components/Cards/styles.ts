import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  box: {
    paddingRight: 15,
    height: "100%",
  },
  container: {
    padding: "100px 150px",
    backgroundColor: "#f5f5f5",
    height: "100vh",
    width: "100%",
    overflow: "scroll",
    boxSizing: "border-box",
  },
  icon: {
    position: "absolute",
    top: 5,
    right: 25,
  },
  link: {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      color: "inherit",
      textDecoration: "none",
    },
  },
});
