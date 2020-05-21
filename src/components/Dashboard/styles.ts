import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    block: {
      textAlign: "center",
      color: theme.palette.text.secondary,
      background: "#f5f5f5",
      whiteSpace: "nowrap",
    },
  })
);
