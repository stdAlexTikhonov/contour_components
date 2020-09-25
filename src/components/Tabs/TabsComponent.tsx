import React, { useEffect } from "react";
import {
  makeStyles,
  Theme,
  withStyles,
  createStyles,
} from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab, { TabProps } from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { REPORT, ITEMS, CHART, VIEW_META } from "../../utils/constants";
import { Dashboard } from "../Dashboard";
import { sleep } from "../../utils/helpers";
import { Tabs as MyTabs } from ".";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface StyledTabProps1 {
  label: string;
}
type StyledTabProps = StyledTabProps1 & TabProps;

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

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      lineHeight: 0,
      whiteSpace: "nowrap",
      textTransform: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      "&:focus": {
        opacity: 1,
      },
    },
    wrapper: {
      flexDirection: "unset",
      justifyContent: "unset",
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

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
  handleListOfViews,
  session,
  language,
}) => {
  useEffect(() => {
    handleChange(0); //при открытии отчёта выбираем первую вкладку
    handleListOfViews(
      tabs!.map((el: any) => ({
        caption: el.caption,
        view: el.code,
        slice: el.slice,
        report: el.report,
      }))
    );
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
              report,
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
          handleDataQuery(
            {
              method: VIEW_META,
              session,
              language,
              solution,
              project,
              report: report,
              view: data.code,
              slice: data.slice,
            },
            newValue
          );

          break;
        default:
          console.log("Data type:" + data.type);
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
              <StyledTab
                key={i}
                label={item.caption}
                style={{ outline: "none" }}
                {...a11yProps(i)}
              />
            ))}
          </Tabs>
        </AppBar>
      )}
      {tabs?.map((item: any, i) => {
        return (
          <TabPanel value={value} index={i} key={i}>
            {item.data && item.data.tabs && <MyTabs tabs={item.data.tabs} />}
            {item.data && item.data.dashboard && (
              <Dashboard
                handleViews={handleListOfViews}
                dashboard={item.data.dashboard}
                metadata={item.data.metadata}
              />
            )}
            {item.component && <item.component />}
          </TabPanel>
        );
      })}
    </div>
  );
};
