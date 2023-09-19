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
        <p>This is the collaboration space for the replication package of the following paper: Marco Konersmann, Angelika Kaplan, Thomas Kühn, Robert Heinrich, Anne Koziolek, Ralf Reussner and Jan Jürjens, Mahmood al Door, Nicolas Boltz, Marco Ehl, Dominik Fuchß, Katharina Großer, Sebastian Hahner, Jan Keim, Matthias Lohr, Timur Sağlam, Sophie Schulz, and Jan-Philipp Töberg. Evaluation Methods and Replicability of Software Architecture Research Objects. In Proceedings of the 19th IEEE International Conference on Software Architecture (ICSA 2022), Hawaii, USA (virtual). IEEE, May 2022. Accepted for publication.<br />
        The replication package is archived at <a href="https://zenodo.org/record/6044059">Zenodo</a>.
        Also checkout our <a href="https://gitlab.com/SoftwareArchitectureResearch/StateOfPractice">Repository</a>.</p>
      </Alert>
    </div>
  );
}

