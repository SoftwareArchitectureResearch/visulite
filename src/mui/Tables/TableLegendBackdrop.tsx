import { Alert, Backdrop, Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { ElementInformation } from "./TableUtils";

export default function TableLegendBackdrop() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Grid item style={{ justifyContent: "center", display: "flex" }}>
      <Tooltip title={"Legend"}>
        <IconButton onClick={handleOpen}>
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <TableLegendAlert />
      </Backdrop>
    </Grid>
  );
}
function TableLegendAlert() {
  return (
    <div>
      <Alert severity="info" color="info" style={{ fontSize: "1rem" }}>
        {showArray()}
      </Alert>
    </div>
  );
}

export const LegendArray: ElementInformation[] = [
  { id: "RO", label: "Research Object" }, //0
  { id: "E", label: "Evaluation" }, //1
];

function showArray() {
  return LegendArray.map((elem) => (
    <div key={elem.id}>
      {elem.id + ": " + elem.label} <br />
    </div>
  ));
}
