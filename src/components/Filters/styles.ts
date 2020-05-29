import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
      marginTop: 0,
      marginLeft: 10,
    },
    selectEmpty: {
      display: "flex",
      width: "100%",
      overflow: "scroll",
      minHeight: 50,
    },
    test: {
      transform: "translate(0, 10.5px) scale(0.75)",
    },
    test1: {},
  })
);
