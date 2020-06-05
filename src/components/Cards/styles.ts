import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  box: {
    minWidth: 275,
    position: "relative",
    paddingRight: 15,
    height: "100%",
  },
  container: {
    display: "flex",
    backgroundColor: "#f5f5f5",
    height: "100%",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-around",
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
