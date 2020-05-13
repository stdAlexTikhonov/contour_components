import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../../store/config_store";
import { DataForQuery, Common } from "../../utils/types";
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

interface Props {}

type IProps = Props & LinkStateToProps & LinkDispatchToProps;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 5,
    position: "relative",
    paddingRight: 15,
  },
  container: {
    display: "flex",
    backgroundColor: "#cfe8fc",
    height: "100vh",
    paddingTop: "100px",
    flexWrap: "wrap",
    alignItems: "flex-start",
    overflow: "scroll",
    justifyContent: "space-around",
    cursor: "pointer",
  },
  icon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
});

const CardsComponent: React.FC<IProps> = ({
  items,
  session,
  getSolutionData,
  getFolderData,
  getGlobalData,
  language,
}) => {
  const classes = useStyles();
  const { solution, folder } = useParams();

  useEffect(() => {
    if (folder && solution) {
      getFolderData({
        method: ITEMS,
        session,
        solution,
        folder,
        language,
      });
    } else if (solution) {
      getSolutionData({
        method: ITEMS,
        session,
        solution,
        language,
      });
    } else {
      getGlobalData({
        method: ITEMS,
        session,
        language,
      });
    }
  }, [
    solution,
    folder,
    session,
    getFolderData,
    getSolutionData,
    getGlobalData,
    language,
  ]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      {items.map((item: any) => {
        let link = "";
        if (item.type === "solution") {
          link = "/" + item.code;
        } else if (item.type === "folder") {
          link = "/" + solution + "/" + item.code;
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

interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
}

interface LinkDispatchToProps {
  getSolutionData: (data_for_query: DataForQuery) => void;
  getFolderData: (data_for_query: DataForQuery) => void;
  getGlobalData: (data_for_query: Common) => void;
}

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  getSolutionData: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);
    if (data.success) {
      console.log("solutions");
      dispatch(setItems(data.items));
    }
    dispatch(resetLoading());
  },
  getFolderData: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);
    if (data.success) {
      console.log("folder");
      dispatch(setItems(data.items));
    }
    dispatch(resetLoading());
  },
  getGlobalData: async (data_for_query: Common) => {
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
