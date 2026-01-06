import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";

const GeographyChart = ({ isDashboard = false, data }) => {
  const colors = tokens();

  const colorScale = ["#f5a49eff", "#fd756b"];

  const mappedFeatures = (geoFeatures?.features ?? []).map((f) => ({
    ...f,
    id: String(f?.properties?.codregion),
  }));

  const chartData = Array.isArray(data) ? data : [];
  const maxValue = Math.max(...chartData.map((d) => Number(d.value) || 0), 1);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 10, position: "relative" }}>

      <div style={{ position: "absolute", inset: 0 }}>
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
          projectionScale={isDashboard ? 1220 : 1600}
          projectionTranslation={isDashboard ? [5.6, -0.355] : [5.5, -0.34]}
          projectionRotation={isDashboard ? [0, 0] : [0, 0]}
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
    </div>
  );
};

export default GeographyChart;
