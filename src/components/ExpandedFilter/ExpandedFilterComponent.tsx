import React from "react";
import { IProps } from "./types";
import Button from "@material-ui/core/Button";
import { CustomRadioPaddingRight } from "../CustomDropdown/CustomRadio";
import { CustomCheckboxPaddingRight } from "../CustomDropdown/CustomCheckbox";
import { sliceWord } from "../../utils/helpers";

export const ExpandedFilterComponent: React.FC<IProps> = ({
  filter_items,
  multiple,
  checked,
  direction,
  handleToggle,
  handleRadio,
  button,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: "flex-start",
      }}
    >
      {filter_items.length > 0 &&
        filter_items.map((item: any) => (
          <Button
            key={item.code}
            aria-describedby={item.code}
            size="small"
            variant={button ? "contained" : "text"}
            color={
              button
                ? checked.indexOf(item.value) !== -1
                  ? "primary"
                  : "secondary"
                : "default"
            }
            onClick={
              multiple ? handleToggle(item.value) : handleRadio(item.value)
            }
            disabled={item.disabled}
            style={
              button
                ? { marginRight: 3, outline: "none" }
                : {
                    outline: "none",
                    textTransform: "capitalize",
                    fontWeight: "normal",
                    display: item.disabled ? "none" : "flex",
                  }
            }
          >
            {!button &&
              (multiple ? (
                <CustomCheckboxPaddingRight
                  checked={checked.indexOf(item.value) !== -1}
                  onClick={handleToggle(item.value)}
                  disabled={item.disabled}
                />
              ) : (
                <CustomRadioPaddingRight
                  checked={
                    checked.length === 1
                      ? checked.indexOf(item.value) !== -1
                      : checked[0] === item.value
                  }
                  onChange={handleRadio(item.value)}
                  disabled={item.disabled}
                />
              ))}
            <div
              style={{
                textAlign: direction === "row" ? "center" : "left",
                width: "100%",
              }}
            >
              {item.value}
            </div>
          </Button>
        ))}
    </div>
  );
};
