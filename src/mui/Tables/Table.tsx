import { BibWrapper } from "../../domain/model/BibWrapper";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  gridClasses,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { TableRowCalculator } from "../../services/TableRowCalculator";
import { Button, Grid } from "@mui/material";
import React from "react";
import { setTableData } from "../../services/chartUtils";
import DeselectIcon from "@mui/icons-material/Deselect";
import TableLegendBackdrop from "./TableLegendBackdrop";
import { ElementInformation } from "./TableUtils";

//table constants
const SmallColumnWidth = 200;
const MediumColumnWidth = 300;
const LargeColumnwidth = 400;
const TableSideMargin = 80;
const ClearSelectionButtonName = "Clear Selection";
const TableTitle = "Overview of Papers";

/**
 * Table presenting the overview of papers
 * @param props necessary for table rendering such as table rows and size
 * @returns the table component
 */
export default function StickyHeadTable(props: TableInput) {
  //rows
  let filteredData = props.inputData.filter((p) =>
    props.filteredKey.find((elem) => elem == p.literatureClasses.citekey)
  );

  const tableRowCalculator = new TableRowCalculator();
  let dataGridrows = filteredData.map((paper, index) => {
    let result = tableRowCalculator.calculateTableRows(paper, index);
    return result;
  });
  if (dataGridrows.length == 0) {
    return <div></div>;
  }
  // columns

  let defaultcolumnVisibilityModel: GridColumnVisibilityModel = {
    documentVenue: false,
    researchLevel: false,
    kind: false,
    toolSupport: false,
    inputData: false,
    replicationPackage: false,
    threatsToValidity: false,
    referencedThreatsToValidityGuideline: false,
    productQuality: false,
    qualityOfAnalyticalMethod: false,
    referencedEvaluationGuideline: false,
  };

  const dataGridcolumns: GridColDef[] = ColumnIdLabelArray.map((col) => {
    if (col.id === "title" || col.id === "author") {
      return {
        field: col.id,
        headerName: col.label,
        minWidth: LargeColumnwidth,
        hideable: true,
      };
    }
    if (
      col.id === "paperClasses" ||
      col.id === "threatsToValidity" ||
      col.id === "researchObjects" ||
      col.id === "evaluationMethods" ||
      col.id === "qualityInUse" ||
      col.id === "productQuality" ||
      col.id === "qualityOfAnalyticalMethod" ||
      col.id === "referencedEvaluationGuideline"
    ) {
      return {
        field: col.id,
        headerName: col.label,
        minWidth: MediumColumnWidth,
        hideable: true,
        renderCell: (params: any) =>
          params.value == null ? (
            <div></div>
          ) : (
            <ul>
              {params.value.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ),
      };
    }

    return {
      field: col.id,
      headerName: col.label,
      minWidth: SmallColumnWidth,
      hideable: true,
    };
  });
  function handleClearSelectionButtonClick() {
    dataGridrows = props.inputData.map((paper, index) => {
      let result = tableRowCalculator.calculateTableRows(paper, index);
      return result;
    });
    setTableData(
      props.setTablePapers,
      props.inputData.map((d) => d.literatureClasses.citekey)
    );
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
          startIcon={<DeselectIcon />}
          onClick={handleClearSelectionButtonClick}
        >
          {ClearSelectionButtonName}
        </Button>
      </GridToolbarContainer>
    );
  }
  return (
    <Box
      sx={{
        height: "auto",
        maxWidth: window.innerWidth - TableSideMargin,
        overflowY: { display: "none" },
        "& .active-scroll-bars": { overflow: "-moz-hidden-unscrollable" },
      }}
    >
      <DataGridTitle></DataGridTitle>
      <DataGrid
        rows={dataGridrows}
        columns={dataGridcolumns}
        getRowHeight={() => "auto"}
        getRowClassName={(params: any) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        disableVirtualization
        initialState={{
          columns: {
            columnVisibilityModel: defaultcolumnVisibilityModel,
          },
        }}
        sx={{
          "& .MuiButton-root": {
            fontSize: "1.5rem",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "2rem",
          },
          "& .MuiTypography-root": {
            color: "dodgerblue",
            fontSize: "1.5rem",
          },
          fontSize: "1.5rem",
          "&.MuiButtonBase-root": { fontSize: "1.5rem" },
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
          "& .MuiDataGrid-row.even": {
            backgroundColor: " #434956",
          },

          "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
            borderRight: `1px solid grey`,
            textAlign: "left",
            verticalAlign: "top",
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
}
const DataGridTitle = () => {
  return (
    <Grid container className="centeringGrid">
      <Grid item>{TableTitle}</Grid>
      <TableLegendBackdrop></TableLegendBackdrop>
    </Grid>
  );
};

interface TableInput {
  inputData: BibWrapper[];
  filteredKey: string[];
  setTablePapers: React.Dispatch<React.SetStateAction<string[]>>;
}

/**function hideEmptyLines

 * hides empty lines that can result of a visibility model change for columns
 * @param params the current visibility model of table (which columns are to be shown)
 * @param rows the current table rows
 * @param columns the table's columns
 * @returns a table with no empty line after visibility model change
 */

export const ColumnIdLabelArray: ElementInformation[] = [
  { id: "citekey", label: "Citekey" }, //0
  { id: "title", label: "Title" }, //1
  { id: "author", label: "Author" }, //2
  { id: "documentVenue", label: "Document Venue" }, //3
  { id: "paperClasses", label: "Paper Classes" }, //4
  { id: "researchLevel", label: "Research Level" }, //5
  { id: "kind", label: "Kind" }, //6
  { id: "toolSupport", label: "Tool Support" }, //7
  { id: "inputData", label: "Input Data" }, //8
  { id: "replicationPackage", label: "Replication Package" }, //9
  { id: "threatsToValidity", label: "Threats To Validity" }, //10
  {
    id: "referencedThreatsToValidityGuideline",
    label: "Referenced Threats To Validity",
  }, //11

  { id: "researchObjects", label: "Research Objects (RO)" }, //12
  { id: "evaluationMethods", label: "Evaluation Methods" }, //13
  { id: "qualityInUse", label: "Quality in Use" }, //14
  { id: "productQuality", label: "Product Quality" }, //15
  { id: "qualityOfAnalyticalMethod", label: "Quality Of Analytical Methods" }, //16
  {
    id: "referencedEvaluationGuideline",
    label: "Referenced Evaluation Guideline",
  }, //17
];
