import { Box, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { createTheme } from "@mui/material";
import React, { useState } from "react";
import { BibWrapper } from "../domain/model/BibWrapper";
import "./Layout.css";
import { CurrentChart, drawChartMap } from "../services/chartDrawer";
import { processDataMap } from "../services/chartCounter";
import Table from "../mui/Tables/Table";
import ButtonAppBar from "../mui/AppBar";
/**
 * here is the global definition of the theme used by all MUI components in the is webpage
 */
const theme = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          root: {
            "& $notchedOutline": {
              borderColor: "pink",
            },
            "&$focused $notchedOutline": {
              borderColor: "red",
            },
            color: "blue",
            "& .MuiSelect-root ~ $notchedOutline": {
              borderColor: "green",
            },
            "&$focused .MuiSelect-root ~ $notchedOutline": {
              borderColor: "orange",
            },
            "& .MuiSelect-root": {
              color: "purple",
            },
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          "& .MuiTablePagination-actions": {
            fontSize: "1.5rem",
          },
          "& .MuiTablePagination-actions button": {
            fontSize: "1.5rem",
          },

          "& .MuiTablePagination-caption": {
            fontSize: "1.5rem",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: "1.5rem",
          },
          "& .MuiTablePagination-selectLabel": {
            fontSize: "1.5rem",
          },
          "& .MuiInputBase-root": {
            fontSize: "1.5rem",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.5em",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: "info",
          severity: "info",
          fontSize: "1rem",
        },
      },
    },
  },

  palette: {
    text: {
      primary: "#FFF",
      secondary: "#FFF",
    },
    mode: "dark",
  },
});

/**
 * represents the structuring of UI components of the page
 * @param props contains the array of papers (in internal model) to be visualized
 * @returns the web page
 */
export function Layout(props: Props) {
  const [chartInput, setChartInput] = useState(
    processDataMap[Object.keys(processDataMap)[0]](props.data)
  );
  const [Chart, setChart] = useState(Object.keys(drawChartMap)[0]);
  const [tablePapers, setTablePapers] = useState<string[]>(
    props.data.map((p) => p.literatureClasses.citekey)
  );
  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar
        theme={theme}
        setChartInput={setChartInput}
        data={props.data}
        setChart={setChart}
      ></ButtonAppBar>
      <Box className="box">
        <Grid item>
          <CurrentChart
            data={chartInput}
            chartType={Chart}
            setTablePapers={setTablePapers}
          ></CurrentChart>
        </Grid>

        <Grid container className="centeringGrid">
          <Table
            inputData={props.data}
            filteredKey={tablePapers}
            setTablePapers={setTablePapers}
          ></Table>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

/**
 * array of the papers to be visualized
 */
interface Props {
  data: BibWrapper[];
}
