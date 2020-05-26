import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
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
  }, [session, solution, folder, project, p_folder, language]);

  return (
    <div className={classes.container}>
      <Grid
        container
        style={{ margin: 0, justifyContent: "center" }}
        spacing={5}
      >
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
            <Grid item key={item.code} xs={8} md={6} lg={4}>
              <Card className={classes.root}>
                <Link
                  to={link}
                  className={classes.link}
                  onClick={() => handleClick()}
                >
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {item.caption}
                    </Typography>
                    {item.icon && (
                      <img src={"data:image/png;base64," + item.icon} />
                    )}
                    <Typography>{item.description}</Typography>
                    {item.type === "project" && (
                      <LibraryBooksIcon
                        color="primary"
                        className={classes.icon}
                      />
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
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
