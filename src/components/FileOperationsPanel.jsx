import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";




export const FileOperationsPanel = ({
  files,
  blockSizeKB,
  onCreateFile,
  onDeleteFile,
  onResizeFile,
  onAnalyze,
  onDefragment,
}) => {
  const [name, setName] = React.useState("report.log");
  const [sizeBlocks, setSizeBlocks] = React.useState(8);
  const [strategy, setStrategy] =
    React.useState("first-fit");

  const [resizeTarget, setResizeTarget] = React.useState(null);
  const [resizeSizeKB, setResizeSizeKB] = React.useState(0);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateFile(name.trim(), sizeBlocks * blockSizeKB, strategy);
  };

  const openResize = (file) => {
    setResizeTarget(file);
    setResizeSizeKB(file.sizeKB);
  };

  const handleResizeConfirm = () => {
    if (!resizeTarget) return;
    onResizeFile(resizeTarget.id, resizeSizeKB);
    setResizeTarget(null);
  };

  return (
    <>
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
          title="File Operations"
          subheader="Create virtual files and choose how they get placed."
        />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="File name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.6)" },
              }}
            />

            <Stack spacing={0.75}>
              <Typography variant="body2" color="text.secondary" fontWeight={400}>
                Size: {sizeBlocks} blocks
              </Typography>
              <Slider
                value={sizeBlocks}
                min={1}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_, v) => setSizeBlocks(v)}
                sx={{
                  color: "#7c3aed",
                  "& .MuiSlider-track": {
                    background:
                      "linear-gradient(to right, #ef4444 0%, #dc2626 100%)",
                  },
                  "& .MuiSlider-rail": { opacity: 0.25 },
                  "& .MuiSlider-thumb": { bgcolor: "#ef4444" },
                }}
              />
            </Stack>

            <FormControl fullWidth>
              <InputLabel id="strategy-label">Allocation strategy</InputLabel>
              <Select
                labelId="strategy-label"
                value={strategy}
                label="Allocation strategy"
                onChange={(e) =>
                  setStrategy(e.target.value)
                }
              >
                <MenuItem value="first-fit">First Fit</MenuItem>
                <MenuItem value="best-fit">Best Fit</MenuItem>
                <MenuItem value="random">Random</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { filter: "brightness(1.1)" },
              }}
              fullWidth
            >
              Create File
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card
        sx={{
          mt: 3,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>
                Existing Files
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  fontSize: 12,
                  color: "#1e293b",
                  bgcolor: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                {files.length}
              </Box>
            </Stack>
          }
          subheader="Delete or resize to create fragmentation patterns."
        />
        <CardContent>
          {files.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No files yet. Create a few with different sizes and strategies to
              see fragmentation appear.
            </Typography>
          ) : (
            <Stack spacing={1.25}>
              {files.map((file) => (
                <Stack
                  key={file.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.25,
                    bgcolor: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 10px 18px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: file.color,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.sizeKB >= 1024
                        ? `${(file.sizeKB / 1024).toFixed(1)} MB`
                        : `${file.sizeKB} KB`}
                      {" • "}
                      {file.blocks.length} blocks • {file.fragments.length}{" "}
                      fragment{file.fragments.length === 1 ? "" : "s"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SwapVertIcon />}
                      onClick={() => openResize(file)}
                      sx={{
                        background: "rgba(255,255,255,0.5)",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "rgba(124,58,237,0.1)" },
                      }}
                    >
                      Resize
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDeleteFile(file.id)}
                      sx={{
                        background: "rgba(255,255,255,0.5)",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "rgba(124,58,237,0.1)" },
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={2.5}>
            <Button
              onClick={onAnalyze}
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { filter: "brightness(1.1)" },
              }}
            >
              Analyze
            </Button>
            <Button
              onClick={onDefragment}
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { filter: "brightness(1.1)" },
              }}
            >
              Defrag
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={!!resizeTarget}
        onClose={() => setResizeTarget(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Resize file</DialogTitle>
        <DialogContent>
          {resizeTarget && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {resizeTarget.name}
              </Typography>
              <Typography variant="caption" gutterBottom display="block">
                New size ({resizeSizeKB >= 1024 ? "MB" : "KB"})
              </Typography>
              <Slider
                value={resizeSizeKB}
                min={blockSizeKB}
                max={4096}
                step={blockSizeKB}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) =>
                  v >= 1024 ? `${(v / 1024).toFixed(1)} MB` : `${v} KB`
                }
                onChange={(_, v) => setResizeSizeKB(v)}
                sx={{
                  color: "#7c3aed",
                  "& .MuiSlider-track": {
                    background:
                      "linear-gradient(to right, #ef4444 0%, #dc2626 100%)",
                  },
                  "& .MuiSlider-thumb": { bgcolor: "#ef4444" },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResizeTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleResizeConfirm}
            sx={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              fontWeight: 800,
              "&:hover": { filter: "brightness(1.1)" },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

