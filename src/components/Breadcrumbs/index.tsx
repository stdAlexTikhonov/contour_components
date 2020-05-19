import React from "react";
import { withRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { IProps } from "./types";

const BreadcrumbsComponent: React.FC<IProps> = ({ history }) => {
  const breadcrumbs = history.location.pathname
    .split("/")
    .filter((item: string) => !["project", "report"].includes(item));

  const len = breadcrumbs.length - 1;

  return history.location.pathname !== "/" ? (
    <Breadcrumbs aria-label="breadcrumb" style={{ color: "white" }}>
      {breadcrumbs.map((breadcrumb: string, i: number) => {
        if (i < len)
          return (
            <Link
              color="inherit"
              href={history.location.pathname.split(breadcrumb)[0] + breadcrumb}
              key={i}
            >
              {breadcrumb}
            </Link>
          );
        else
          return (
            <Typography key={i} color="inherit">
              {breadcrumb}
            </Typography>
          );
      })}
    </Breadcrumbs>
  ) : null;
};

export const SimpleBreadcrumbs = withRouter(BreadcrumbsComponent);
