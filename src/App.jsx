import React from "react";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  allocateFileBlocks,
  computeFragments,
  computeStats,
  createInitialStorage,
  defaultColors,
  defragment,
} from "./storageModel";
// StorageDashboard removed
import { FragmentationMap } from "./components/FragmentationMap";
import { FileOperationsPanel } from "./components/FileOperationsPanel";
import { HelpNotes } from "./components/HelpNotes";

const App = () => {
  const [state, setState] = React.useState(() =>
    createInitialStorage(4, 256)
  );
  const [stats, setStats] = React.useState(() =>
    computeStats(state)
  );
  const [history, setHistory] = React.useState([]);
  const [selectedFileId, setSelectedFileId] = React.useState(null);
  const [defraggedState, setDefraggedState] =
    React.useState(null);
  const [defraggedStats, setDefraggedStats] =
    React.useState(null);
  const [viewMode, setViewMode] = React.useState("live");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const pushHistory = React.useCallback(
    (newState) => {
      const newStats = computeStats(newState);
      const snapshot = {
        timestamp: Date.now(),
        fragmentationPercent: newStats.fragmentationPercent,
      };
      setHistory((prev) => [...prev, snapshot]);
      setStats(newStats);
    },
    [setHistory, setStats]
  );

  const nextColor = React.useCallback((index) => {
    return defaultColors[index % defaultColors.length];
  }, []);

  const handleCreateFile = (
    name,
    sizeKB,
    strategy
  ) => {
    const blocksNeeded = Math.ceil(sizeKB / state.blockSizeKB);
    const allocated = allocateFileBlocks(state, blocksNeeded, strategy);
    if (!allocated) {
      return;
    }

    const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const file = {
      id,
      name,
      sizeKB,
      blocks: allocated,
      fragments: computeFragments(allocated),
      color: nextColor(state.files.length),
    };

    const newBlocks = [...state.blocks];
    for (const index of allocated) newBlocks[index] = id;

    const newState = {
      ...state,
      blocks: newBlocks,
      files: [...state.files, file],
    };
    setState(newState);
    pushHistory(newState);
  };

  const handleDeleteFile = (id) => {
    const file = state.files.find((f) => f.id === id);
    if (!file) return;
    const newBlocks = state.blocks.map((b) => (b === id ? null : b));
    const newFiles = state.files.filter((f) => f.id !== id);
    const newState = { ...state, blocks: newBlocks, files: newFiles };
    setState(newState);
    pushHistory(newState);
    if (selectedFileId === id) setSelectedFileId(null);
  };

  const handleResizeFile = (id, newSizeKB) => {
    const file = state.files.find((f) => f.id === id);
    if (!file) return;
    const currentBlocks = file.blocks.length;
    const newBlocksNeeded = Math.ceil(newSizeKB / state.blockSizeKB);

    if (newBlocksNeeded === currentBlocks) return;

    if (newBlocksNeeded < currentBlocks) {
      // Shrink: free some of the highest‑index blocks
      const blocksToKeep = file.blocks.slice(0, newBlocksNeeded);
      const blocksToFree = file.blocks.slice(newBlocksNeeded);
      const newBlocksArr = [...state.blocks];
      for (const idx of blocksToFree) newBlocksArr[idx] = null;
      const updatedFile = {
        ...file,
        sizeKB: newSizeKB,
        blocks: blocksToKeep,
        fragments: computeFragments(blocksToKeep),
      };
      const newFiles = state.files.map((f) =>
        f.id === id ? updatedFile : f
      );
      const newState = { ...state, blocks: newBlocksArr, files: newFiles };
      setState(newState);
      pushHistory(newState);
    } else {
      // Grow: try to allocate extra blocks
      const extraNeeded = newBlocksNeeded - currentBlocks;
      const allocated = allocateFileBlocks(state, extraNeeded, "random");
      if (!allocated) {
        return;
      }
      const newBlocksArr = [...state.blocks];
      for (const idx of allocated) newBlocksArr[idx] = id;
      const allBlocks = [...file.blocks, ...allocated];
      const updatedFile = {
        ...file,
        sizeKB: newSizeKB,
        blocks: allBlocks,
        fragments: computeFragments(allBlocks),
      };
      const newFiles = state.files.map((f) =>
        f.id === id ? updatedFile : f
      );
      const newState = { ...state, blocks: newBlocksArr, files: newFiles };
      setState(newState);
      pushHistory(newState);
    }
  };

  const handleAnalyze = () => {
    const s = computeStats(state);
    setStats(s);
  };

  const handleDefrag = () => {
    const newState = defragment(state);
    const newStats = computeStats(newState);
    setDefraggedState(newState);
    setDefraggedStats(newStats);
    setViewMode("after");
  };

  React.useEffect(() => {
    // initial stats
    setStats(computeStats(state));
  }, []);

  const shownState = viewMode === "after" && defraggedState ? defraggedState : state;

  const glassCardSx = {
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(148,163,184,0.2)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  const primaryGradient = "linear-gradient(135deg, #ef4444, #dc2626)";

  const Sidebar = (
    <Box
      sx={{
        width: { xs: "100%", md: 280 },
        flexShrink: 0,
        position: { md: "sticky" },
        top: 0,
        height: { md: "100vh" },
        bgcolor: "#ffffff",
        borderRight: "1px solid rgba(148,163,184,0.2)",
        boxShadow: "8px 0 24px rgba(0,0,0,0.04)",
        px: 2,
        py: 2.5,
        display: isMdDown && !mobileNavOpen ? "none" : "block",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>
          {/* Summary removed */}
        </Typography>
        {isMdDown && (
          <IconButton onClick={() => setMobileNavOpen(false)} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Stack>

      {/* Compact metrics in the left panel */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <MetricCard
          label="Capacity Used"
          value={`${((stats.totalBlocks * state.blockSizeKB) / 1024).toFixed(1)} MB`}
          sub={`${stats.usedBlocks}/${stats.totalBlocks} blocks`}
          progress={stats.totalBlocks === 0 ? 0 : (stats.usedBlocks / stats.totalBlocks) * 100}
        />
        <MetricCard
          label="Fragmentation"
          value={`${stats.fragmentationPercent.toFixed(1)}%`}
          sub="Lower is better"
          progress={stats.fragmentationPercent}
        />
        <MetricCard
          label="Largest Free"
          value={`${stats.largestContiguousFreeBlock} blocks`}
          sub="Contiguous space"
          progress={
            stats.totalBlocks === 0
              ? 0
              : (stats.largestContiguousFreeBlock / stats.totalBlocks) * 100
          }
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.2)" }} />

      <Button
        startIcon={<HelpOutlineIcon />}
        onClick={() => {
          setShowHelp(true);
          setMobileNavOpen(false);
        }}
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          background: "rgba(255,255,255,0.5)",
          border: "1px solid #cbd5e1",
          borderRadius: 2,
          color: "#1e293b",
          fontWeight: 600,
          "&:hover": { bgcolor: "rgba(124,58,237,0.1)" },
        }}
      >
        Help / Notes
      </Button>

      {/* Pikachu Section */}
      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          style={{ width: 120, height: 120, marginBottom: 8 }}
        />
        <Typography variant="caption" sx={{ color: "#64748b", textAlign: "center" }}>
          Pikachu says: Check the notes!
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fafbff" }}>
      {Sidebar}

      <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
        {showHelp ? (
          <HelpNotes onBack={() => setShowHelp(false)} />
        ) : (
          <>
            {/* Top bar */}
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", lg: "center" }}
              sx={{ mb: 2.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {isMdDown && (
                  <IconButton
                    onClick={() => setMobileNavOpen((v) => !v)}
                    sx={{ bgcolor: "#ffffff", border: "1px solid rgba(148,163,184,0.2)" }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Box>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#1e293b", lineHeight: 1.1 }}>
                    Storage Fragmentation Simulator
                  </Typography>
                </Box>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={viewMode === "after" ? "After Defrag" : "Live"}
                    onClick={() => setViewMode((m) => (m === "live" ? "after" : "live"))}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  />
                  <Button
                    onClick={handleAnalyze}
                    sx={{
                      background: primaryGradient,
                      color: "white",
                      borderRadius: 2,
                      px: 2,
                      fontWeight: 600,
                      "&:hover": { filter: "brightness(1.1)" },
                    }}
                  >
                    Analyze
                  </Button>
                  <Button
                    onClick={handleDefrag}
                    sx={{
                      background: primaryGradient,
                      color: "white",
                      borderRadius: 2,
                      px: 2,
                      fontWeight: 600,
                      "&:hover": { filter: "brightness(1.1)" },
                    }}
                  >
                    Defrag
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            {/* Content grid */}
            <Stack spacing={3}>
              {/* Row 2: map + operations */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "3fr 2fr" },
                  gap: 3,
                  alignItems: "start",
                }}
              >
                <FragmentationMap
                  totalBlocks={shownState.totalBlocks}
                  blocks={shownState.blocks}
                  files={shownState.files}
                  selectedFileId={selectedFileId}
                  onSelectFile={setSelectedFileId}
                />

                <FileOperationsPanel
                  files={state.files}
                  blockSizeKB={state.blockSizeKB}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  onResizeFile={handleResizeFile}
                  onAnalyze={handleAnalyze}
                  onDefragment={handleDefrag}
                />
              </Box>

              <Divider sx={{ borderColor: "rgba(148,163,184,0.2)" }} />
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                This simulator is purely logical: it does not access your real disk or files.
              </Typography>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;

function MetricCard({
  label,
  value,
  sub,
  progress,
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid rgba(148,163,184,0.2)",
        bgcolor: "rgba(255,255,255,0.9)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#1e293b", fontSize: 18, fontWeight: 600, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography sx={{ color: "#64748b", fontSize: 12, mt: 0.25 }}>
        {sub}
      </Typography>
      <Box
        sx={{
          mt: 1,
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(148,163,184,0.25)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${clamped}%`,
            height: "100%",
            background: "linear-gradient(to right, #ef4444 0%, #dc2626 100%)",
            transition: "width 250ms ease",
          }}
        />
      </Box>
    </Box>
  );
}

