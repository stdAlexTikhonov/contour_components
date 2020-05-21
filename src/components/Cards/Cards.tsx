import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { ITEMS } from "../../utils/constants";
import BarChartIcon from "@material-ui/icons/BarChart";
import FolderIcon from "@material-ui/icons/Folder";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ClassIcon from "@material-ui/icons/Class";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const CardsComponent: React.FC<IProps> = ({
  items,
  session,
  handleDataQuery,
  language,
  handleClick,
}) => {
  const classes = useStyles();
  const { solution, folder, project, p_folder } = useParams();

  useEffect(() => {
    handleDataQuery({
      method: ITEMS,
      session,
      solution,
      folder,
      project,
      p_folder,
      language,
    });
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
            <Link
              to={link}
              className={classes.link}
              onClick={() => handleClick(item.caption, link)}
            >
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
