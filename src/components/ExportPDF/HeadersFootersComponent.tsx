import React from "react";
import { CustomCheckbox } from "../CustomDropdown/CustomCheckbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { LinkStateToPropsTabs } from "./types";

export const HeadersFootersComponent: React.FC<LinkStateToPropsTabs> = ({
  print_page,
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
  };

  const handleScaleHeaderFooter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScaleHeaderFooter(event.target.checked);
  };

  const CustomSelect: React.FC<{ title: string; type: number }> = ({
    title,
    type,
  }) => {
    const headerFooter = headersFooters.find((item) => item.Type === type);
    const values = ["Title", "Date/Time", "Page #", "Page # of #"];

    const [selected, setSelected] = React.useState(headerFooter?.Text);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelected(event.target.value as string);
      const changed = headersFooters.map((item) => {
        if (item.Type === type) {
          item.Text = event.target.value as string;
        }
        return item;
      });

      setHeadersFooters(changed);
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
          label="Headers/Footers"
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
              <CustomSelect title={"Top/Left"} type={5} />
              <CustomSelect title={"Top/Center"} type={1} />
              <CustomSelect title={"Top/Right"} type={2} />
            </FormGroup>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect title={"Bottom/Left"} type={3} />
              <CustomSelect title={"Bottom/Center"} type={4} />
              <CustomSelect title={"Bottom/Right"} type={0} />
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
          label="Change scale along with the document"
        />
      </FormControl>
    </div>
  );
};
