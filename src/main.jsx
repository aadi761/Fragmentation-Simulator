import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

// Drive-style palette (exact values from spec)
const driveTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafbff",
      paper: "#ffffff",
    },
    primary: { main: "#ef4444" },
    secondary: { main: "#dc2626" },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    divider: "rgba(148,163,184,0.2)",
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fafbff",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={driveTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

