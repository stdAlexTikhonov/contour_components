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
        let link = breadcrumb.code;
        switch (breadcrumb.type) {
          case "solution":
            link = breadcrumb.code;
            break;
          case "folder":
            if (i < pi) {
              link = bredcrumbs_transformed[0] + "/" + breadcrumb.code;
            }

            if (i > pi) {
              link =
                bredcrumbs_transformed[0] +
                "/project/" +
                bredcrumbs_transformed[pi] +
                "/" +
                breadcrumb.code;
            }

            break;
          case "project":
            link = bredcrumbs_transformed[0] + "/project/" + breadcrumb.code;
            break;
        }

        if (i < len)
          return (
            <Link color="inherit" href={"/" + link} key={i}>
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
