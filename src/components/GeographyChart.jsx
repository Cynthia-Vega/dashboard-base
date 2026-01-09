import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { scaleThreshold } from "d3-scale";

const GeographyChart = ({ isDashboard = false, data }) => {
  const colors = tokens();

  const C_1_4 = "#fec8c4";
  const C_5_10 = "#feaca6";
  const C_10P = "#fd756b";

  const colorScale = scaleThreshold()
    .domain([5, 11])
    .range([C_1_4, C_5_10, C_10P]);

  const mappedFeatures = (geoFeatures?.features ?? []).map((f) => ({
    ...f,
    id: String(f?.properties?.codregion),
  }));

  const chartData = Array.isArray(data) ? data : [];

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 10, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <ResponsiveChoropleth
          data={chartData}
          features={mappedFeatures}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}

          domain={[5, 11]}

          colors={colorScale}

          unknownColor="#666666"
          label="properties.Region"
          valueFormat=".0f"
          projectionType="mercator"
          projectionScale={isDashboard ? 1220 : 1750}
          projectionTranslation={isDashboard ? [5.6, -0.355] : [6, -0.345]}
          projectionRotation={isDashboard ? [0, 0] : [0, 0]}
          borderWidth={1}
          borderColor="#ffffff"
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 15,
          top: 15,
          zIndex: 5,
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 12,
          padding: "10px 12px",
          color: colors.primary[100],
          fontSize: 12.5,
          lineHeight: 1.1,
          display: "grid",
          rowGap: 6,
          minWidth: 88,
        }}
      >
        {[
          { label: "1–4", color: C_1_4 },
          { label: "5–10", color: C_5_10 },
          { label: "> 10", color: C_10P },
        ].map((it) => (
          <div
            key={it.label}
            style={{
              display: "grid",
              gridTemplateColumns: "12px 1fr",
              columnGap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 5,
                background: it.color,
                display: "block",          
                flexShrink: 0,
              }}
            />
            <span style={{ display: "block" }}>{it.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GeographyChart;
