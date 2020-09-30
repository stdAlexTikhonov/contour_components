import React, { useEffect } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { useStyles } from "./styles";
import { TabProps } from "./types";
import { CustomCheckbox } from "../CustomDropdown/CustomCheckbox";
import { CustomRadio } from "../CustomDropdown/CustomRadio";
import {
  BREAK_HEADER,
  GRAY_SCALE_MODE,
  SCALE,
  TABLE_ON_THE_PAGE,
  ROWS_ON_THE_PAGE,
  COLUMNS_ON_THE_PAGE,
  ACTUAL_SIZE,
  SHOW_ON_EACH_PAGE,
  COLUMNS,
  ROWS,
  TITLE,
  HEADER,
  FOOTER,
} from "../../utils/constants";

export const CommonComponent: React.FC<TabProps> = ({
  print_page,
  settingPrintPage,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(print_page?.FitToPage);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+(event.target as HTMLInputElement).value);
    print_page!.FitToPage = +(event.target as HTMLInputElement).value;
    settingPrintPage(print_page!);
  };

  const mapping = new Map();
  mapping.set("columns", "HorizontalScaleVisible");
  mapping.set("rows", "VerticalScaleVisible");
  mapping.set("title", "CaptionOnEachPage");
  mapping.set("header", "HeaderOnEachPage");
  mapping.set("footer", "FooterOnEachPage");

  const [state, setState] = React.useState({
    columns: print_page?.HorizontalScaleVisible,
    rows: print_page?.VerticalScaleVisible,
    title: print_page?.CaptionOnEachPage,
    header: print_page?.HeaderOnEachPage,
    footer: print_page?.FooterOnEachPage,
  });

  const mapping2 = new Map();
  mapping2.set("fullWidth", "BreakHeader");
  mapping2.set("grayScale", "GrayScale");

  const [group, setGroup] = React.useState({
    fullWidth: print_page?.BreakHeader,
    grayScale: print_page?.GrayScale,
  });

  const handleChangeCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    const prop = mapping.get(event.target.name) as string;
    print_page[prop] = event.target.checked;
    settingPrintPage(print_page!);
  };

  const handleChangeCheckboxes2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroup({ ...group, [event.target.name]: event.target.checked });
    const prop = mapping2.get(event.target.name) as string;
    print_page[prop] = event.target.checked;
    settingPrintPage(print_page!);
  };

  const { columns, rows, title, header, footer } = state;
  const { fullWidth, grayScale } = group;

  return (
    <div className={classes.container}>
      <FormControl
        className={classes.formControl}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={fullWidth}
              onChange={handleChangeCheckboxes2}
              name="fullWidth"
            />
          }
          label={BREAK_HEADER}
        />
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={grayScale}
              onChange={handleChangeCheckboxes2}
              name="grayScale"
            />
          }
          label={GRAY_SCALE_MODE}
          style={{ marginLeft: 60 }}
        />
      </FormControl>
      <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">{SCALE}</FormLabel>
          <RadioGroup
            aria-label="scale"
            name="scale1"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value={0}
              control={<CustomRadio />}
              label={ACTUAL_SIZE}
            />
            <FormControlLabel
              value={1}
              control={<CustomRadio />}
              label={TABLE_ON_THE_PAGE}
            />
            <FormControlLabel
              value={2}
              control={<CustomRadio />}
              label={COLUMNS_ON_THE_PAGE}
            />
            <FormControlLabel
              value={3}
              control={<CustomRadio />}
              label={ROWS_ON_THE_PAGE}
            />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">{SHOW_ON_EACH_PAGE}</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={columns}
                  onChange={handleChangeCheckboxes}
                  name="columns"
                />
              }
              label={COLUMNS}
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={rows}
                  onChange={handleChangeCheckboxes}
                  name="rows"
                />
              }
              label={ROWS}
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={title}
                  onChange={handleChangeCheckboxes}
                  name="title"
                />
              }
              label={TITLE}
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={header}
                  onChange={handleChangeCheckboxes}
                  name="header"
                />
              }
              label={HEADER}
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={footer}
                  onChange={handleChangeCheckboxes}
                  name="footer"
                />
              }
              label={FOOTER}
            />
          </FormGroup>
        </FormControl>
      </div>
    </div>
  );
};
