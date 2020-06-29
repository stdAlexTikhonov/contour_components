import React from "react";
import Button from "@material-ui/core/Button";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

type IProps = {
  multiple: boolean;
  sort: boolean;
  visible: boolean;
  handleInversion: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  handleSort: () => void;
  handleExpand: () => void;
  showHidden: () => void;
};

export const ControlButtons: React.FC<IProps> = ({
  visible,
  multiple,
  handleInversion,
  handleOk,
  handleCancel,
  handleSort,
  handleExpand,
  showHidden,
  sort,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button
        style={{
          outline: "none",
          minWidth: "unset",
        }}
        onClick={handleExpand}
      >
        <BookmarkBorderIcon />
      </Button>
      <Button
        style={{
          outline: "none",
          minWidth: "unset",
        }}
        onClick={showHidden}
      >
        {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </Button>
      {multiple && (
        <Button
          style={{
            outline: "none",
            minWidth: "unset",
          }}
          onClick={handleInversion}
        >
          <AutorenewIcon />
        </Button>
      )}
      <Button
        style={{ outline: "none", minWidth: "unset" }}
        onClick={handleSort}
      >
        <ArrowRightAltIcon
          style={{
            transform: sort ? "rotate(-90deg)" : "rotate(90deg)",
          }}
        />
      </Button>
      <Button
        style={{
          outline: "none",
          minWidth: "unset",
        }}
        onClick={handleOk}
      >
        Ok
      </Button>
      <Button style={{ outline: "none" }} onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
};
