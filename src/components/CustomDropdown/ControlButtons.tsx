import React from "react";
import Button from "@material-ui/core/Button";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";

type IProps = {
  multiple: boolean;
  sort: boolean;
  visible: boolean;
  expanded: boolean;
  enableExpand: boolean;
  handleInversion: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  handleSort: () => void;
  handleExpand: () => void;
  showHidden: () => void;
};

export const ControlButtons: React.FC<IProps> = ({
  visible,
  expanded,
  multiple,
  enableExpand,
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
        paddingTop: 5,
      }}
    >
      {enableExpand && (
        <Button
          style={{
            outline: "none",
            minWidth: "unset",
          }}
          onClick={handleExpand}
        >
          {expanded ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </Button>
      )}
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
            display: "flex",
          }}
          onClick={handleInversion}
        >
          <div
            style={{
              margin: "auto",
              width: 10,
              height: 14,
            }}
          >
            <ArrowRightAltIcon
              style={{
                transform: "rotate(90deg)",
                position: "absolute",
                top: 9,
                left: 0,
              }}
            />
            <ArrowRightAltIcon
              style={{
                transform: "rotate(-90deg)",
                position: "absolute",
                top: 8,
                left: 5,
              }}
            />
          </div>
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
