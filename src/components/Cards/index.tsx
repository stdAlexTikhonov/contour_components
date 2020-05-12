import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../../store/config_store";

interface Props {}

type IProps = Props & LinkStateToProps;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const CardsComponent: React.FC<IProps> = ({ items }) => {
  const classes = useStyles();
  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: "#cfe8fc",
        height: "100vh",
        paddingTop: "100px",
      }}
    >
      {items.map((item: any) => (
        <Card key={item.code} className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {item.caption}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

interface LinkStateToProps {
  items: any;
}

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
});

export const Cards = connect(mapStateToProps)(CardsComponent);
