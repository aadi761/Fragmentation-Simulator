import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";




const BLOCKS_PER_ROW_OPTIONS = [16, 32, 64];

export const FragmentationMap = ({
  totalBlocks,
  blocks,
  files,
  selectedFileId,
  onSelectFile,
}) => {
  const [blocksPerRow, setBlocksPerRow] =
    React.useState(32);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const fileById = React.useMemo(
    () =>
      files.reduce((acc, f) => {
        acc[f.id] = f;
        return acc;
      }, {}),
    [files]
  );

  const rows = Math.ceil(totalBlocks / blocksPerRow);

  const getBlockStyle = (index) => {
    const fileId = blocks[index];
    if (!fileId) {
      return {
        background: "rgba(148,163,184,0.18)",
        border: "1px solid rgba(148,163,184,0.25)",
      };
    }
    const file = fileById[fileId];
    const isSelected = selectedFileId === fileId;
    const fragmentCount = file.fragments.length;

    const baseColor = file.color;
    const gradient =
      fragmentCount > 1
        ? `linear-gradient(135deg, #ef4444, #dc2626)`
        : baseColor;

    return {
      background: gradient,
      boxShadow: isSelected ? "0 0 0 2px rgba(239,68,68,0.55)" : "none",
      borderRadius: 3,
    };
  };

  const handleBlockClick = (index) => {
    const fileId = blocks[index];
    if (!fileId) {
      onSelectFile(null);
      return;
    }
    onSelectFile(fileId === selectedFileId ? null : fileId);
  };

  const renderBlock = (row, col) => {
    const index = row * blocksPerRow + col;
    if (index >= totalBlocks) return null;
    const fileId = blocks[index];
    const file = fileId ? fileById[fileId] : null;
    const fragmentIndex = file
      ? file.fragments.findIndex(
        (frag) => index >= frag.start && index < frag.start + frag.length
      )
      : -1;

    const tooltipTitle = file ? (
      <div>
        <Typography variant="subtitle2" fontWeight={600}>
          {file.name}
        </Typography>
        <Typography variant="caption">
          Block #{index} • Fragment {fragmentIndex + 1} of{" "}
          {file.fragments.length}
        </Typography>
      </div>
    ) : (
      <Typography variant="caption">Empty block #{index}</Typography>
    );

    return (
      <Tooltip key={index} title={tooltipTitle} arrow>
        <div
          role="button"
          onClick={() => handleBlockClick(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex((v) => (v === index ? null : v))}
          style={{
            width: 14,
            height: 14,
            margin: 2,
            borderRadius: 2,
            cursor: file ? "pointer" : "default",
            transition: "transform 120ms ease, box-shadow 120ms ease",
            ...getBlockStyle(index),
            ...(hoveredIndex === index
              ? {
                boxShadow: "0 0 0 2px rgba(239,68,68,0.55), 0 6px 18px rgba(239,68,68,0.14)",
                transform: "translateY(-1px)",
              }
              : null),
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Card
      sx={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title="Fragmentation Map"
        subheader="Each square is a logical block. Red/reddish gradients indicate fragmentation."
        action={
          <ToggleButtonGroup
            size="small"
            exclusive
            value={blocksPerRow}
            onChange={(_, val) => val && setBlocksPerRow(val)}
          >
            {BLOCKS_PER_ROW_OPTIONS.map((opt) => (
              <ToggleButton key={opt} value={opt}>
                {opt}/row
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: { xs: 420, lg: 560 },
            pb: 0.5,
          }}
        >
          {Array.from({ length: rows }).map((_, row) => (
            <Box
              key={row}
              sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}
            >
              {Array.from({ length: blocksPerRow }).map((__, col) =>
                renderBlock(row, col)
              )}
            </Box>
          ))}
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Tip: Click a file block to highlight all of its fragments.
        </Typography>
      </CardContent>
    </Card>
  );
};

