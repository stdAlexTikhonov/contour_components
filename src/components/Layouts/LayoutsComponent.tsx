import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { IProps } from "./types";
import { SET_LAYOUT } from "../../utils/constants";
import { useParams } from "react-router-dom";

export const LayoutsComponent: React.FC<IProps> = ({
  label,
  layouts,
  session,
  language,
  report: report_from_state,
  current_layout,
  setLayout,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetLayout = (code: string) => {
    const data_for_query = {
      method: SET_LAYOUT,
      solution,
      session,
      language,
      project,
      report: report_from_state || report_from_params,
      layout: code,
      isUser: true,
    };
    setLayout(data_for_query);
    setAnchorEl(null);
  };

  return (
    layouts && (
      <div>
        {label ? (
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            color="primary"
            style={{ color: "white", minWidth: "unset", outline: "none" }}
            onClick={handleClick}
          >
            {label}
            <ExpandMoreIcon />
          </Button>
        ) : (
          <IconButton
            size="small"
            style={{ outline: "none" }}
            aria-label="delete"
            onClick={handleClick}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {layouts.map((item: any) => (
            <MenuItem
              key={item.code}
              onClick={() => handleSetLayout(item.code)}
            >
              {item.caption}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  );
};
