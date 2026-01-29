import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";




const formatTime = (t) => {
  const d = new Date(t);
  return `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, "0")}`;
};

export const FragmentationTimeline = ({ history }) => {
  return (
    <Card elevation={4}>
      <CardHeader
        title="Fragmentation Timeline"
        subheader="How fragmentation evolves as you create, delete, and resize files."
      />
      <CardContent>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Perform a few file operations to start building the timeline.
          </Typography>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={history}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  labelFormatter={(v) => `Time ${formatTime(Number(v))}`}
                  formatter={(val) => [
                    `${val.toFixed(1)}%`,
                    "Fragmentation",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="fragmentationPercent"
                  stroke="#90caf9"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

