import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 261,
      backgroundColor: theme.palette.background.paper,
      fontSize: "1rem",
      color: "black",
      fontWeight: 400,
    },
    margin: {
      position: "absolute",
      right: 11,
      top: 9,
      cursor: "pointer",
    },
  })
);
