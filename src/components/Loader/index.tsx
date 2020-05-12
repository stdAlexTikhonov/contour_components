import React from "react";
import { Loader } from "./Loader";
import { useStyles } from "./styles";

export const LoaderComponent: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.loader}>
        <Loader />
      </div>
    </div>
  );
};
