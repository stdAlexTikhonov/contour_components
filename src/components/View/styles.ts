import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
    margin: 0,
    padding: 10,
    boxSizing: "border-box",
  },
  item: {
    height: "100%",
    width: "100%",
    margin: 0,
    background: "white",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  title: {
    whiteSpace: "break-spaces",
  },
});
