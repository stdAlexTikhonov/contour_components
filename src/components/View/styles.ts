import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
    margin: 0,
    padding: 10,
    boxSizing: "border-box",
  },
  item: { height: "100%", width: "100%", border: "1px solid blue", margin: 0 },
});
