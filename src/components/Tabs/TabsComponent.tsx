import React, { useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { REPORT, ITEMS } from "../../utils/constants";
import { Dashboard } from "../Dashboard";
import { sleep } from "../../utils/helpers";
import { Tabs as MyTabs } from ".";

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
      {value === index && <Box>{children}</Box>}
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
  useEffect(() => {
    handleChange(0); //при открытии отчёта выбираем первую вкладку
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { solution, project, report } = useParams();

  const handleChange = async (newValue: number) => {
    await sleep(300); //иногда данные не успевают подгрузиться
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
              report: "Main",
              slice: data.code,
            },
            newValue
          );
          break;
        case "report":
          handleDataQuery(
            {
              method: ITEMS,
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
          alert("This is view");
          break;
        default:
          alert("Data type:" + data.type);
      }
    }
  };
  return (
    <div className={classes.root}>
      {tabs && tabs.length > 1 && (
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={(event, newValue) => handleChange(newValue)}
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
      )}
      {tabs?.map((item: any, i) => {
        return (
          <TabPanel value={value} index={i} key={i}>
            {item.data && item.data.tabs && (
              <MyTabs
                tabs={item.data.tabs}
                session={session}
                language={language}
              />
            )}
            {item.data && item.data.dashboard && (
              <Dashboard
                dashboard={item.data.dashboard}
                metadata={item.data.metadata}
              />
            )}
          </TabPanel>
        );
      })}
    </div>
  );
};
