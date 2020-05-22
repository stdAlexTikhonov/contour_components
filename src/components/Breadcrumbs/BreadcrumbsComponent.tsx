import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Breadcrumb } from "../../types/actions";

export const BreadcrumbsComponent: React.FC<IProps> = ({ breadcrumbs }) => {
  const len = breadcrumbs.length - 1;
  const bredcrumbs_transformed = breadcrumbs.map((item) => item.code);
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" maxItems={3} className={classes.root}>
      {breadcrumbs.map((breadcrumb: Breadcrumb, i: number) => {
        if (["project", "report"].includes(breadcrumb.type))
          bredcrumbs_transformed[i] =
            breadcrumb.type + "/" + bredcrumbs_transformed[i];

        const link = bredcrumbs_transformed.slice(0, i + 1).join("/");

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
