import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";

const data = [
  { id: "15", value: 42 },
  { id: "1", value: 18 },
  { id: "2", value: 25 },
  { id: "3", value: 10 },
  { id: "4", value: 30 },
  { id: "5", value: 55 },
  { id: "13", value: 120 },
];


const GeographyChart = ({ isDashboard = false }) => {
  const colors = tokens();

  // 👇 aseguramos que cada feature tenga id que machea con data.id
  const mappedFeatures = geoFeatures.features.map((f) => ({
    ...f,
    id: String(f.properties.codregion),
  }));

  return (
    <ResponsiveChoropleth
      data={data}
      features={mappedFeatures}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.primary[100],
            },
          },
          legend: {
            text: {
              fill: colors.primary[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.primary[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.primary[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.primary[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[100],
          },
        },
      }}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 120]}
      unknownColor="#666666"
      label="properties.Region"
      valueFormat=".0f"
      projectionType="mercator"
      // 👇 AQUÍ LA MAGIA:
      // modo página completa vs modo card del dashboard
      projectionScale={isDashboard ? 210 : 950}
      projectionTranslation={isDashboard ? [1.55, -0.2] : [1.7, -0.25]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1}
      borderColor="#ffffff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: false,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.primary[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: false,
                translateX: 1,
                translateY: -100,
                itemsSpacing: 3,
                itemWidth: 65,
                itemHeight: 10,
                itemDirection: "left-to-right",
                itemTextColor: colors.primary[100],
                itemOpacity: 0.85,
                symbolSize: 9,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
      }
    />
  );
};

export default GeographyChart;