import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { ITEMS } from "../../utils/constants";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import { setItems } from "../../actions/items";
import BarChartIcon from "@material-ui/icons/BarChart";
import FolderIcon from "@material-ui/icons/Folder";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ClassIcon from "@material-ui/icons/Class";
import { useStyles } from "./styles";
import { IProps, LinkDispatchToProps, LinkStateToProps } from "./types";

const CardsComponent: React.FC<IProps> = ({
  items,
  session,
  handleDataQuery,
  language,
}) => {
  const classes = useStyles();
  const { solution, folder, project, p_folder } = useParams();

  useEffect(() => {
    if (p_folder) {
      handleDataQuery({
        method: ITEMS,
        session,
        solution,
        project,
        folder: p_folder,
        language,
      });
    } else if (project) {
      handleDataQuery({
        method: ITEMS,
        session,
        solution,
        project,
        language,
      });
    } else if (folder && solution) {
      handleDataQuery({
        method: ITEMS,
        session,
        solution,
        folder,
        language,
      });
    } else if (solution) {
      handleDataQuery({
        method: ITEMS,
        session,
        solution,
        language,
      });
    } else {
      handleDataQuery({
        method: ITEMS,
        session,
        language,
      });
    }
  }, [solution, folder, session, handleDataQuery, language, project, p_folder]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      {items.map((item: any) => {
        let link = "";
        if (item.type === "report") {
          link =
            "/" + solution + "/project/" + project + "/report/" + item.code;
        } else if (item.type === "folder" && project) {
          link = "/" + solution + "/project/" + project + "/" + item.code;
        } else if (item.type === "solution") {
          link = "/" + item.code;
        } else if (item.type === "folder") {
          link = "/" + solution + "/" + item.code;
        } else if (item.type === "project") {
          link = "/" + solution + "/project/" + item.code;
        }
        return (
          <Card key={item.code} className={classes.root}>
            <Link to={link} className={classes.link}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {item.caption}
                </Typography>
                {item.type === "project" && (
                  <LibraryBooksIcon color="primary" className={classes.icon} />
                )}

                {item.type === "folder" && (
                  <FolderIcon color="primary" className={classes.icon} />
                )}

                {item.type === "report" && (
                  <BarChartIcon color="primary" className={classes.icon} />
                )}

                {item.type === "solution" && (
                  <ClassIcon color="primary" className={classes.icon} />
                )}
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </Container>
  );
};

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);
    if (data.success) {
      dispatch(setItems(data.items));
    }
    dispatch(resetLoading());
  },
});

export const Cards = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsComponent);
