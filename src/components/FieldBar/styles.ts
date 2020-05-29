import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  aside: {
    flexBasis: "30%",
    paddingTop: 5,
    display: "flex",
    overflow: "scroll",
    backgroundColor: "white",
  },
  main: {
    flexGrow: 1,
  },
});
