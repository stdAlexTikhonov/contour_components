import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  box: {
    paddingRight: 15,
    height: "100%",
  },
  container: {
    display: "flex",
    padding: "100px 150px",
    backgroundColor: "#f5f5f5",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "center",
  },
  row: {
    display: "flex",
    justifyContent: "center",
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
