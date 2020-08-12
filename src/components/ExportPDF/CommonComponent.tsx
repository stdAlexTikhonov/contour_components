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
          label="Break header width"
        />
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={grayScale}
              onChange={handleChangeCheckboxes2}
              name="grayScale"
            />
          }
          label="Gray scale mode"
          style={{ marginLeft: 60 }}
        />
      </FormControl>
      <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scale</FormLabel>
          <RadioGroup
            aria-label="scale"
            name="scale1"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value={0}
              control={<CustomRadio />}
              label="Actual size"
            />
            <FormControlLabel
              value={1}
              control={<CustomRadio />}
              label="Insert table on the one page"
            />
            <FormControlLabel
              value={2}
              control={<CustomRadio />}
              label="Insert columns on the one page"
            />
            <FormControlLabel
              value={3}
              control={<CustomRadio />}
              label="Insert rows on the one page"
            />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Show on each page</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={columns}
                  onChange={handleChangeCheckboxes}
                  name="columns"
                />
              }
              label="Columns"
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={rows}
                  onChange={handleChangeCheckboxes}
                  name="rows"
                />
              }
              label="Rows"
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={title}
                  onChange={handleChangeCheckboxes}
                  name="title"
                />
              }
              label="Title"
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={header}
                  onChange={handleChangeCheckboxes}
                  name="header"
                />
              }
              label="Header"
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={footer}
                  onChange={handleChangeCheckboxes}
                  name="footer"
                />
              }
              label="Footer"
            />
          </FormGroup>
        </FormControl>
      </div>
    </div>
  );
};
