import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, IProps, LinkDispatchToProps } from "./types";
import { AppActions } from "../../types/actions";
import { ThunkDispatch } from "redux-thunk";
import { sliceBreadcrumbs } from "../../actions/breadcrumbs";

export const BreadcrumbsComponent: React.FC<IProps> = ({
  breadcrumbs,
  handleClick,
}) => {
  const len = breadcrumbs.length - 1;
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, i) => {
        if (i < len)
          return (
            <Link
              color="inherit"
              to={breadcrumb.link}
              key={i}
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                handleClick(e, i - 1)
              }
            >
              {breadcrumb.caption}
            </Link>
          );
        else
          return (
            <Typography color="textPrimary">{breadcrumb.caption}</Typography>
          );
      })}
    </Breadcrumbs>
  );
};

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  breadcrumbs: state.breadcrumbs,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleClick: (event, index) => {
    event.preventDefault();
    dispatch(sliceBreadcrumbs(index));
  },
});

export const SimpleBreadcrumbs = connect(
  mapStateToProps,
  mapDispatchToProps
)(BreadcrumbsComponent);
