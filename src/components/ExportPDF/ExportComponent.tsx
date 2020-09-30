import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import PrintIcon from "@material-ui/icons/Print";
import { Tabs } from "../Tabs";
import { IProps } from "./types";
import {
  PRINT_PAGE_SETUP,
  EXPORT,
  IMAGES_AND_OTHER_STUFF,
  COMMON,
  HEADERS_FOOTERS,
  MARGINS_ORIENTATION,
  PRINT,
} from "../../utils/constants";
import { MarginsOrientation } from "./MarginsOrientation";
import { Common } from "./Common";
import { HeadersFooters } from "./HeadersFooters";
import Button from "@material-ui/core/Button";
import { DialogProps } from "./types";

const emails = ["username@gmail.com", "user02@gmail.com"];

function SimpleDialog(props: DialogProps) {
  const tabs = [
    { caption: COMMON, type: "print_settings", component: Common },
    {
      caption: MARGINS_ORIENTATION,
      type: "print_settings",
      component: MarginsOrientation,
    },
    {
      caption: HEADERS_FOOTERS,
      type: "print_settings",
      component: HeadersFooters,
    },
  ];

  const { onClose, selectedValue, open, onExport } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Print settings</DialogTitle>
      <Tabs tabs={tabs} />
      <Button
        variant="contained"
        color="primary"
        style={{ outline: "none" }}
        onClick={() => onExport()}
      >
        {PRINT}
      </Button>
    </Dialog>
  );
}

export const ExportPDF: React.FC<IProps> = ({
  handleDataQuery,
  session,
  language,
  report: report_from_store,
  print_page,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = async () => {
    await handleDataQuery({
      method: PRINT_PAGE_SETUP,
      session,
      solution,
      project,
      language,
      report: report_from_store || report_from_params,
    });

    setOpen(true);
  };

  const export_pdf = async () => {
    const result = await handleDataQuery({
      method: EXPORT,
      session,
      solution,
      project,
      language,
      report: report_from_store || report_from_params,
      pageSetup: JSON.stringify(print_page),
      format: "pdf",
    });

    window.open(IMAGES_AND_OTHER_STUFF + result, "_blank");
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <IconButton
        size="small"
        style={{ outline: "none" }}
        aria-label="delete"
        onClick={handleClickOpen}
      >
        <PrintIcon fontSize="small" />
      </IconButton>
      <SimpleDialog
        onExport={export_pdf}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};
