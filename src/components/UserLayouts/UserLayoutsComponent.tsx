import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import LineStyleIcon from "@material-ui/icons/LineStyle";
import IconButton from "@material-ui/core/IconButton";
import { IProps } from "./types";
import {
  SET_LAYOUT,
  SAVE_USER_LAYOUT,
  DELETE_USER_LAYOUT,
} from "../../utils/constants";
import { useParams } from "react-router-dom";
import { SaveAs } from "./Dialog";

export const UserLayoutsComponent: React.FC<IProps> = ({
  setLayout,
  session,
  language,
  report: report_from_state,
  layouts,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    const data_for_query = {
      method: SAVE_USER_LAYOUT,
      caption: "test",
      solution,
      session,
      language,
      project,
      report: report_from_state || report_from_params,
      isDefault: false,
      layout: "1",
    };
    setLayout(data_for_query);
  };

  const handleSaveAs = (name: string) => {
    const data_for_query = {
      method: SAVE_USER_LAYOUT,
      caption: name,
      solution,
      session,
      language,
      project,
      report: report_from_state || report_from_params,
      isDefault: false,
      //layout: layout,
    };
    setLayout(data_for_query, layouts);
  };

  const handleDelete = () => {
    const data_for_query = {
      method: DELETE_USER_LAYOUT,
      solution,
      session,
      language,
      project,
      report: report_from_state || report_from_params,
      layout: "1",
    };
    const filtered = layouts.filter((item: any) => item.code !== "1");
    setLayout(data_for_query, filtered);
  };

  return (
    <div>
      <IconButton
        size="small"
        style={{ outline: "none" }}
        aria-label="delete"
        onClick={handleClick}
      >
        <LineStyleIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSave}>Save</MenuItem>
        <MenuItem>
          <SaveAs onSaveAs={handleSaveAs} />
        </MenuItem>
        <MenuItem onClick={handleClose}>Reset</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Default Layout</MenuItem>
      </Menu>
    </div>
  );
};
