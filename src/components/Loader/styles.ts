import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      background: "rgba(0,0,0,0.5)",
      height: "100vh",
      width: "100%",
      zIndex: 333,
      display: "flex",
    },
    loader: {
      margin: "auto",
      color: "white",
    },
  })
);
