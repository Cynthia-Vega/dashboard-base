import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";


const fallbackData = [
  { id: "15", value: 42 },
  { id: "1", value: 18 },
  { id: "2", value: 25 },
  { id: "3", value: 10 },
  { id: "4", value: 30 },
  { id: "5", value: 55 },
  { id: "13", value: 120 },
];



const GeographyChart = ({ isDashboard = false, data }) => {
  const colors = tokens();

  // tu paleta personalizada (puedes cambiar estos colores)
  const colorScale = [
    "#f7c4c1ff", // 0 → casi sin datos (muy claro)
    "#f7c4c1ff", // bajo
    "#f7c4c1ff", // 🔥 SEGUNDO MÁS FUERTE (tu color base)
    "#f5a49eff", // alto
    "#fd756b", // máximo (más fuerte que fd756b)
  ];

  const mappedFeatures = geoFeatures.features.map((f) => ({
    ...f,
    id: String(f.properties.codregion),
  }));

  const chartData =
    data && data.length > 0
      ? data
      : fallbackData;

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <ResponsiveChoropleth
      data={chartData}
      features={mappedFeatures}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, maxValue]}     // aquí puedes fijar [0, 44] si quieres
      colors={colorScale}        // 👈 tu degradado
      unknownColor="#666666"
      label="properties.Region"
      valueFormat=".0f"
      projectionType="mercator"
      projectionScale={isDashboard ? 300 : 850}
      projectionTranslation={isDashboard ? [2.2, -0.2] : [2, -0.34]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1}
      borderColor="#ffffff"
      legends={[
              {
                anchor: "bottom-left",
                direction: "column",
                justify: false,
                translateX: 20,
                translateY: -60,
                itemsSpacing: 6,
                itemWidth: 120,
                itemHeight: 18,
                itemTextColor: colors.primary[100],
                itemOpacity: 0.85,
                symbolSize: 14,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#fff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
    />
  );
};
export default GeographyChart;