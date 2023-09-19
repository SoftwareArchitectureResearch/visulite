import { IconButton, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

/**
 * this button allows the user to download the visualized diagram as SVG
 */
export const DownloadSVGButton = forwardRef((props: Props, ref: any) => {
  const downloadSVG = () => {
    const svgElement = ref.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = props.fileName + ".svg";
    link.click();

    URL.revokeObjectURL(url);
  };
  return (
    <Tooltip title="Download Chart as SVG">
      <IconButton
        onClick={downloadSVG}
        style={{
          fontWeight: "bold",
          position: "absolute",
          top: props.top,
          right: props.right,
        }}
      >
        <DownloadForOfflineIcon style={{ fontSize: "3rem" }} />{" "}
      </IconButton>
    </Tooltip>
  );
});

interface Props {
  fileName: string;
  top: number;
  right: number;
}
