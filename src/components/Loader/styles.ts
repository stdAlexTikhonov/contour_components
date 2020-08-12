import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      top: 0,
      left: 0,
      background: "rgba(0,0,0,0.5)",
      height: "100vh",
      width: "100%",
      zIndex: 1333,
      display: "flex",
    },
    loader: {
      margin: "auto",
      color: "white",
    },
  })
);
