import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    container: {
      display: "flex",
    },
    paper: {
      border: "1px solid #d3d4d5",
      backgroundColor: theme.palette.background.paper,
      borderRadius: 4,
    },
    popper: {
      zIndex: 1150,
      position: "relative",
    },
  })
);
