import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";



const GeographyChart = ({ isDashboard = false, data }) => {
  const colors = tokens();

  // tu paleta personalizada (puedes cambiar estos colores)
  const colorScale = [


    "#f5a49eff", // alto
    "#fd756b", // máximo (más fuerte que fd756b)
  ];

  const mappedFeatures = geoFeatures.features.map((f) => ({
    ...f,
    id: String(f.properties.codregion),
  }));

  const chartData = Array.isArray(data) ? data : []

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
      projectionScale={isDashboard ? 850 : 850}
      projectionTranslation={isDashboard ? [1.8, 0.7] : [1.7, 0.4]}
      projectionRotation={[0, 98,15]}
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
    </div>
  );
};
export default GeographyChart;