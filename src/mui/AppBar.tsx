import { AppBar, Grid, Theme, styled } from "@mui/material";
import SelectOptions from "./SelectOptions";
import InformationBackdrop from "./InformationBackdrop";
import { ChartData } from "../services/chartCounter";
import { BibWrapper } from "../domain/model/BibWrapper";

/**
 * is the app bar in the top of page containing title and selectors
 * @param props input of the appBar
 * theme: is the theme of MUI components
 * setChartInput: is a setter to set the chart input stored as state in layout
 * data: containg the papers to be visualized
 * setchart: is a setter to set the type of chart to be visualized
 * @returns mui appBar component
 */
export default function ButtonAppBar(props: Props) {
  const Title = styled(Grid)(({ theme }) => ({
    backgroundColor: "inherit",
    ...theme.typography.h3,
    padding: theme.spacing(1),
    textAlign: "left",
  }));

  return (
    <Grid>
      <AppBar>
        <Grid container className="container">
          <Grid item>
            <Grid container>
              <Title item theme={props.theme} flexDirection="row">
                VISULITE
              </Title>
              <InformationBackdrop />
            </Grid>
          </Grid>
          <Grid item className="right-item">
            <SelectOptions
              bibData={props.data}
              setChart={props.setChart}
              setChartInput={props.setChartInput}
              theme={props.theme}
            ></SelectOptions>
          </Grid>
        </Grid>
      </AppBar>
    </Grid>
  );
}

/**
 * input of the appBar
 * theme: is the theme of MUI components
 * setChartInput: is a setter to set the chart input stored as state in layout
 * data: containg the papers to be visualized
 * setchart: is a setter to set the type of chart to be visualized
 */
interface Props {
  theme: Theme;
  setChartInput: React.Dispatch<React.SetStateAction<ChartData>>;
  data: BibWrapper[];
  setChart: React.Dispatch<React.SetStateAction<string>>;
}
