import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  aside: {
    display: "flex",
    backgroundColor: "#ecf0f1",
    overflow: "hidden",
  },
  main: {
    flexGrow: 1,
  },
});
