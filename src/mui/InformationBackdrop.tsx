import {
  Alert,
  Backdrop,
  Grid,
  IconButton,
  Link,
  Tooltip,
} from "@mui/material";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";
const TextualContent = "Information text should be added here.";

/**
 * This Backdrop appears after clicking on the info button in app bar with additional information about the webpage.
 * @returns MUI Backdrop with information about page.
 */
export default function InformationBackdrop() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Grid item style={{ justifyContent: "center", display: "flex" }}>
      <Tooltip title={"About Project"}>
        <IconButton onClick={handleOpen}>
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <InformationAlert />
      </Backdrop>
    </Grid>
  );
}
function InformationAlert() {
  return (
    <div>
      <Alert severity="info" color="info">
        {TextualContent}
        <CustomLink text={"link"} url={"https://www.google.com"} />
      </Alert>
    </div>
  );
}

function CustomLink(props: LinkProps) {
  return (
    <Link fontFamily={"inherit"} fontSize={"inherit"} href={props.url}>
      {props.text}
    </Link>
  );
}

interface LinkProps {
  text: string;
  url: any;
}
