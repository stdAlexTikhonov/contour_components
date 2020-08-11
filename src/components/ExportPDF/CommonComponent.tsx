import React from "react";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useStyles } from "./styles";
import { LinkStateToPropsTabs } from "./types";

export const CommonComponent: React.FC<LinkStateToPropsTabs> = ({
  print_page,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState("female");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const [state, setState] = React.useState({
    columns: true,
    rows: false,
    title: print_page?.CaptionOnEachPage,
    header: print_page?.HeaderOnEachPage,
    footer: print_page?.FooterOnEachPage,
  });

  const [group, setGroup] = React.useState({
    fullWidth: false,
    grayScale: print_page?.GrayScale,
  });

  const handleChangeCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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
            <Checkbox
              checked={fullWidth}
              onChange={handleChangeCheckboxes2}
              name="fullWidth"
            />
          }
          label="Stretch the title to full width"
        />
        <FormControlLabel
          control={
            <Checkbox
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
              value="1"
              control={<Radio />}
              label="Actual size"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Insert table on the one page"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="Insert columns on the one page"
            />
            <FormControlLabel
              value="4"
              control={<Radio />}
              label="Insert rows on the one page"
            />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Show on each page</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={columns}
                  onChange={handleChangeCheckboxes}
                  name="columns"
                />
              }
              label="Columns"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rows}
                  onChange={handleChangeCheckboxes}
                  name="rows"
                />
              }
              label="Rows"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={title}
                  onChange={handleChangeCheckboxes}
                  name="title"
                />
              }
              label="Title"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={header}
                  onChange={handleChangeCheckboxes}
                  name="header"
                />
              }
              label="Header"
            />
            <FormControlLabel
              control={
                <Checkbox
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
