import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  aside: {
    flexBasis: "30%",
    display: "flex",
    backgroundColor: "white",
    overflow: "scroll",
  },
  main: {
    flexGrow: 1,
  },
});
