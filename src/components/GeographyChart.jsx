import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const GeographyChart = ({ isDashboard = false, data }) => {
  const colors = tokens();
  const theme = useTheme();

  // ✅ "tablet" = md. Bajo md => vertical en dash
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // paleta personalizada
  const colorScale = ["#f5a49eff", "#fd756b"];

  const mappedFeatures = geoFeatures.features.map((f) => ({
    ...f,
    id: String(f.properties.codregion),
  }));

  const chartData = Array.isArray(data) ? data : [];

  // ✅ evita NaN si value viene undefined/string
  const maxValue = Math.max(...chartData.map((d) => Number(d?.value ?? 0)), 1);

  // =========================
  // Presets (tus valores)
  // =========================
  const PAGE_VERTICAL = {
    scale: 1600,
    translation: [5.5, -0.34],
    rotation: [0, 0],
  };

  const DASH_HORIZONTAL = {
    scale: 1410,
    translation: [1.955, 1.1],
    rotation: [0, 98, 15],
  };

  // ✅ Dash vertical bajo tablet: usa tu preset vertical (el de página)
  // (así no se "pierde" por translation/rotation raras)
  const DASH_VERTICAL = {
    scale: 1150,
    translation: [4.35, -0.355],
    rotation: [0, 0],
  };

  const preset = !isDashboard
    ? PAGE_VERTICAL
    : isMdUp
      ? DASH_HORIZONTAL
      : DASH_VERTICAL;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveChoropleth
        data={chartData}
        features={mappedFeatures}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        domain={[0, maxValue]}
        colors={colorScale}
        unknownColor="#666666"
        label="properties.Region"
        valueFormat=".0f"
        projectionType="mercator"
        projectionScale={preset.scale}
        projectionTranslation={preset.translation}
        projectionRotation={preset.rotation}
        borderWidth={1}
        borderColor="#ffffff"
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: 15,
            translateY: 15,
            itemsSpacing: 6,
            itemWidth: 120,
            itemHeight: 18,
            itemTextColor: colors.primary[100],
            itemOpacity: 0.85,
            symbolSize: 14,
            effects: [
              {
                on: "hover",
                style: { itemTextColor: "#fff", itemOpacity: 1 },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default GeographyChart;
