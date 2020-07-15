import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { FieldBar } from "../FieldBar";
import { Filters } from "../Filters";
import IconButton from "@material-ui/core/IconButton";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { POSITIONS, CHART } from "../../utils/constants";
import { getData } from "../../utils/api";
import { generateUID, sleep } from "../../utils/helpers";
import { POSITIONS_TYPE } from "../FieldBar/types";

export const ViewComponent: React.FC<IProps> = ({
  metadata,
  session,
  language,
  index,
  setCurrentFilters,
  filters: testFilters,
}) => {
  const classes = useStyles();
  const [fieldBar, setFieldBar] = useState(false);
  const [fieldBarPosition, setFieldBarPosition] = useState(0);
  const { solution, project } = useParams();
  const [chart, setChart] = useState<any>(null);
  const [showChart, setShowChart] = useState<boolean>(false);
  const {
    facts,
    rows,
    columns,
    filters,
    attributes,
    slice,
    view,
    visibleFacts,
    report,
    multipleFacts,
    filterDimensions,
  } = metadata;

  useEffect(() => {
    (async () => {
      const data = await getData({
        method: CHART,
        solution,
        project,
        session,
        language,
        view,
        slice,
        report,
      });

      if (data.success) {
        data.chart.id = generateUID();
        setChart(data.chart);
        setShowChart(true);
      }
    })();
  }, []);

  const handleFilterChange = async (cubeSession: string) => {
    setShowChart(false);
    const data = await getData({
      method: CHART,
      solution,
      project,
      session,
      language,
      view,
      slice,
      report,
      cubeSession,
    });

    if (data.success) {
      data.chart.id = generateUID();
      setChart(data.chart);
      setShowChart(true);
    }
  };

  return (
    <Grid
      container
      className={classes.container}
      onClick={() => setCurrentFilters(filterDimensions || filters)}
    >
      <Grid item className={classes.item}>
        <Box justifyContent="flex-start" display="flex">
          <IconButton
            size="small"
            style={{ outline: "none" }}
            aria-label="delete"
            onClick={async () => {
              setFieldBar(!fieldBar);
              setShowChart(false);
              await sleep(200);
              setShowChart(true);
            }}
          >
            <KeyboardIcon fontSize="small" />
          </IconButton>
          {fieldBar && (
            <IconButton
              size="small"
              aria-label="delete"
              style={{ outline: "none" }}
              onClick={async () => {
                setFieldBarPosition(
                  fieldBarPosition === 3 ? 0 : fieldBarPosition + 1
                );
                setShowChart(false);
                await sleep(200);
                setShowChart(true);
              }}
            >
              <AutorenewIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <b className={classes.title}>{metadata.caption}</b>

        {/* {fieldBar && (
          <Filters
            slice={slice}
            view={view}
            facts={facts.items}
            filters={filters}
          />
        )} 
        
        //{testFilters}
        */}

        <Filters
          show={fieldBar}
          position={POSITIONS[fieldBarPosition] as POSITIONS_TYPE}
          facts={facts ? facts.items : []}
          slice={slice}
          view={view}
          report={report}
          filters={filterDimensions || filters}
          visibleFacts={visibleFacts ? visibleFacts : []}
          multipleFacts={multipleFacts}
          chart={showChart ? chart : null}
          filterChange={handleFilterChange}
          meta_index={index}
        />
      </Grid>
    </Grid>
  );
};
