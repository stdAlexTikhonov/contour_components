import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import LineStyleIcon from "@material-ui/icons/LineStyle";
import IconButton from "@material-ui/core/IconButton";
import { IProps } from "./types";
import { SET_LAYOUT } from "../../utils/constants";
import { useParams } from "react-router-dom";
import { SaveAs } from "./Dialog";

export const UserLayoutsComponent: React.FC<IProps> = ({
  setLayout,
  session,
  language,
  report: report_from_state,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    const data_for_query = {
      method: SET_LAYOUT,
      solution,
      session,
      language,
      project,
      report: report_from_state || report_from_params,
      isUser: false,
      //layout:
    };
    setLayout(data_for_query);
    setAnchorEl(null);
  };

  const handleSaveAs = (name: string) => {
    setAnchorEl(null);
    alert(name);
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
        <MenuItem onClick={handleClose}>Save</MenuItem>
        <MenuItem onClick={handleClose}>
          <SaveAs onSaveAs={handleSaveAs} />
        </MenuItem>
        <MenuItem onClick={handleClose}>Reset</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Default Layout</MenuItem>
      </Menu>
    </div>
  );
};
