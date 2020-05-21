import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Breadcrumb } from "../../types/actions";

export const BreadcrumbsComponent: React.FC<IProps> = ({ breadcrumbs }) => {
  const len = breadcrumbs.length - 1;
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb" maxItems={3} className={classes.root}>
      {breadcrumbs.map((breadcrumb: Breadcrumb, i: number) => {
        if (i < len)
          return (
            <Link color="inherit" href={"/"} key={i}>
              {breadcrumb.caption}
            </Link>
          );
        else
          return (
            <Typography key={i} color="inherit">
              {breadcrumb.caption}
            </Typography>
          );
      })}
    </Breadcrumbs>
  );
};
