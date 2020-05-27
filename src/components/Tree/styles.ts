import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    height: "100%", //??
    overflow: "scroll",
  },
  link: {
    fontSize: "1rem",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
    color: "black",
    textDecoration: "none",
  },
});
