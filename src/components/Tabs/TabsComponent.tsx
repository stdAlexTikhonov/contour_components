import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { REPORT } from "../../utils/constants";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const TabsComponent: React.FC<IProps> = ({
  tabs,
  handleDataQuery,
  session,
  language,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { solution, project, report } = useParams();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (tabs) {
      const data: any = tabs[newValue];

      switch (data.type) {
        case "slice":
          handleDataQuery(
            {
              method: REPORT,
              session,
              language,
              solution,
              project,
              report,
              slice: data.code,
            },
            newValue
          );
          break;
        case "report":
          handleDataQuery(
            {
              method: REPORT,
              session,
              language,
              solution,
              project,
              report: data.code,
            },
            newValue
          );
          break;
        case "view":
          break;
        default:
          alert("Data type:" + data.type);
      }
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabs?.map((item: any, i) => (
            <Tab key={i} label={item.caption} {...a11yProps(i)} />
          ))}
        </Tabs>
      </AppBar>
      {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel> */}
    </div>
  );
};
