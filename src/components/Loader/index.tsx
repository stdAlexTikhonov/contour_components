import React from "react";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { useStyles } from "./styles";

export const LoaderComponent: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AutorenewIcon className={classes.loader} />
    </div>
  );
};
