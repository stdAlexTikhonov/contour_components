import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  box: {
    padding: 15,
    height: "100%",
  },
  container: {
    display: "flex",
    padding: 100,
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "center",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
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
