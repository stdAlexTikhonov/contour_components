import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  aside: {
    flexBasis: "30%",
    border: "0.5px solid lightgray",
  },
  main: {
    flexGrow: 1,
  },
});
