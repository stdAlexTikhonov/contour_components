import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    block: {
      textAlign: "center",
      color: theme.palette.text.secondary,
      whiteSpace: "nowrap",
    },
  })
);
