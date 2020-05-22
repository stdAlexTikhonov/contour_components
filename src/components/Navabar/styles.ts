import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { items } from "../../reducers";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
    },
    formControl: {
      minWidth: 120,
    },
    linkStyle: {
      color: "white",
      textDecoration: "none",
      cursor: "pointer",
    },
  })
);
