import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 261,
      backgroundColor: theme.palette.background.paper,
      margin: "5px 2px",
      borderRadius: 3,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
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
