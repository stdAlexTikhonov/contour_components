import React from "react";
import { CustomCheckbox } from "../CustomDropdown/CustomCheckbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { TabProps } from "./types";
import {
  TOP_LEFT,
  TOP_CENTER,
  TOP_RIGHT,
  BOTTOM_CENTER,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  DOC_SCALE,
  HEADERS_FOOTERS,
} from "../../utils/constants";

const DATE_TIME: string = "Date/Time";
const PAGE: string = "Page #";
const PAGE_OF: string = "Page # of #";
const TITLE: string = "Title";

export const HeadersFootersComponent: React.FC<TabProps> = ({
  print_page,
  settingPrintPage,
}) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState(print_page?.HeaderFooterVisible);
  const [scaleHederFooter, setScaleHeaderFooter] = React.useState(
    print_page?.ScaleHeaderFooter || false
  );
  const [headersFooters, setHeadersFooters] = React.useState(
    print_page?.HeaderFooter || [
      { Type: 5, Text: "Title" },
      { Type: 1, Text: "" },
      { Type: 2, Text: "" },
      { Type: 3, Text: "" },
      { Type: 4, Text: "" },
      { Type: 0, Text: "" },
    ]
  );

  const handleVisability = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisible(event.target.checked);
    print_page.HeaderFooterVisible = event.target.checked;
    settingPrintPage(print_page);
  };

  const handleScaleHeaderFooter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScaleHeaderFooter(event.target.checked);
    print_page.ScaleHeaderFooter = event.target.checked;
    settingPrintPage(print_page);
  };

  const CustomSelect: React.FC<{ title: string; type: number }> = ({
    title,
    type,
  }) => {
    const headerFooter = headersFooters.find((item: any) => item.Type === type);
    const values = [TITLE, DATE_TIME, PAGE, PAGE_OF];

    const [selected, setSelected] = React.useState(headerFooter?.Text);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelected(event.target.value as string);
      const changed = headersFooters.map((item: any) => {
        if (item.Type === type) {
          item.Text = event.target.value as string;
        }
        return item;
      });

      setHeadersFooters(changed);
      print_page.HeaderFooter = changed;
      settingPrintPage(print_page);
    };

    return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId={"demo-simple-select-label" + title}
          id={"demo-simple-select" + title}
          value={selected}
          onChange={handleChange}
          style={{ minWidth: 120 }}
        >
          {values.map((item, i) => (
            <MenuItem key={i} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div className={classes.container}>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={visible}
              onChange={handleVisability}
              name="visability"
            />
          }
          label={HEADERS_FOOTERS}
        />
        {visible && (
          <>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect title={TOP_LEFT} type={5} />
              <CustomSelect title={TOP_CENTER} type={1} />
              <CustomSelect title={TOP_RIGHT} type={2} />
            </FormGroup>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect title={BOTTOM_LEFT} type={3} />
              <CustomSelect title={BOTTOM_CENTER} type={4} />
              <CustomSelect title={BOTTOM_RIGHT} type={0} />
            </FormGroup>
          </>
        )}

        <FormControlLabel
          control={
            <CustomCheckbox
              checked={scaleHederFooter}
              onChange={handleScaleHeaderFooter}
              name="changeScale"
            />
          }
          label={DOC_SCALE}
        />
      </FormControl>
    </div>
  );
};
