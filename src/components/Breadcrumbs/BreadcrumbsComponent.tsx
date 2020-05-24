import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Breadcrumb } from "../../types/actions";

export const BreadcrumbsComponent: React.FC<IProps> = ({ breadcrumbs }) => {
  const len = breadcrumbs.length - 1;

  //***** Refactor this *****
  const bt = breadcrumbs.map((item) => item.type);
  const pi = bt.indexOf("project");
  //**** Refactor this  ******

  const bredcrumbs_transformed = breadcrumbs.map((item) => item.code);
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" maxItems={3} className={classes.root}>
      {breadcrumbs.map((breadcrumb: Breadcrumb, i: number) => {
        //******** Refactor this **********/
        let link = "";
        if (i > pi)
          link =
            bredcrumbs_transformed[0] +
            "/" +
            (pi > 1 ? bredcrumbs_transformed[pi - 1] + "/" : "") +
            "project/" +
            bredcrumbs_transformed[pi] +
            "/" +
            breadcrumb.code;
        else if (pi === i)
          link =
            bredcrumbs_transformed[0] +
            "/" +
            (pi > 1 ? bredcrumbs_transformed[pi - 1] + "/" : "") +
            "project/" +
            bredcrumbs_transformed[pi];
        else
          link =
            bredcrumbs_transformed[0] + "/" + (i > 0 ? breadcrumb.code : "");
        //******** Refactor this ********

        if (i < len)
          return (
            <Link
              color="inherit"
              href={process.env.REACT_APP_DEV_URL + link}
              key={i}
            >
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
