import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(3),
    },
    formControl2: {
      margin: theme.spacing(3),
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "8ch",
      },
    },
    container: {
      width: 600,
      height: 350,
      overflow: "auto",
    },
  })
);
