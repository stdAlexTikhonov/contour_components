import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Typography from "@material-ui/core/Typography";
import SimpleBar from "simplebar-react";
import { ITEMS } from "../../utils/constants";
import { isMobile } from "../../utils/helpers";
import BarChartIcon from "@material-ui/icons/BarChart";
import FolderIcon from "@material-ui/icons/Folder";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ClassIcon from "@material-ui/icons/Class";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { useMediaQuery } from "@material-ui/core";

export const CardsComponent: React.FC<IProps> = ({
  items,
  session,
  handleDataQuery,
  language,
  handleClick,
}) => {
  const classes = useStyles();
  const { solution, folder, project, p_folder } = useParams();

  const isSlimScreen = useMediaQuery("(max-width: 500px");

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
    <SimpleBar style={{ maxHeight: "100vh" }}>
      <Container
        className={classes.container}
        fluid
        style={{ padding: isSlimScreen || isMobile ? 0 : 100 }}
      >
        <Row className={classes.row}>
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
              <Col
                key={item.code}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 4 }}
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Card className={classes.box}>
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
                        <img
                          style={{ width: "100%" }}
                          src={"data:image/png;base64," + item.icon}
                        />
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
                        <BarChartIcon
                          color="primary"
                          className={classes.icon}
                        />
                      )}

                      {item.type === "solution" && (
                        <ClassIcon color="primary" className={classes.icon} />
                      )}
                    </CardContent>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </SimpleBar>
  );
};
