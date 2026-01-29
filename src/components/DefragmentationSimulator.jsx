import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";




const MiniMap = ({ blocks, files, title }) => {
  const theme = useTheme();
  const fileById = React.useMemo(
    () =>
      files.reduce((acc, f) => {
        acc[f.id] = f;
        return acc;
      }, {}),
    [files]
  );

  const total = blocks.length;
  const blocksPerRow = total <= 128 ? 16 : 32;
  const rows = Math.ceil(total / blocksPerRow);

  const getColor = (idx) => {
    const id = blocks[idx];
    if (!id) {
      return theme.palette.mode === "dark"
        ? "#272c3c"
        : theme.palette.grey[300];
    }
    return fileById[id]?.color ?? theme.palette.primary.main;
  };

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{title}</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: 180,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: "flex" }}>
            {Array.from({ length: blocksPerRow }).map((__, c) => {
              const idx = r * blocksPerRow + c;
              if (idx >= total) return null;
              return (
                <div
                  key={idx}
                  style={{
                    width: 6,
                    height: 6,
                    background: getColor(idx),
                    margin: 1,
                    borderRadius: 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </Stack>
  );
};

export const DefragmentationSimulator = ({
  state,
  stats,
  defraggedState,
  defraggedStats,
  onAnalyze,
  onDefragment,
}) => {
  return (
    <Card elevation={4} className="mb-3">
      <CardHeader
        title="Defragmentation Simulator"
        subheader="Compare the disk layout before and after defragmentation."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={onAnalyze}
            >
              Analyze fragmentation
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<AutoFixHighIcon />}
              onClick={onDefragment}
            >
              Defragment storage
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MiniMap
              blocks={state.blocks}
              files={state.files}
              title="Before defrag"
            />
            <Typography variant="body2" mt={1}>
              Fragmentation: {stats.fragmentationPercent.toFixed(1)}% • Access
              cost ×{stats.simulatedAccessCost.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {defraggedState && defraggedStats ? (
              <>
                <MiniMap
                  blocks={defraggedState.blocks}
                  files={defraggedState.files}
                  title="After defrag"
                />
                <Typography variant="body2" mt={1}>
                  Fragmentation:{" "}
                  {defraggedStats.fragmentationPercent.toFixed(1)}% • Access
                  cost ×{defraggedStats.simulatedAccessCost.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Run defragmentation to see how the layout can be compacted into
                contiguous regions, improving access cost.
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

