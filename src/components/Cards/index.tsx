import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

interface Props {}

export const Cards: React.FC<Props> = () => (
  <Container
    maxWidth="lg"
    style={{ backgroundColor: "#cfe8fc", height: "100vh" }}
  ></Container>
);
