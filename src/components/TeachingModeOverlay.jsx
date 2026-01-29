import React from "react";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Switch,
  Typography,
} from "@mui/material";



export const TeachingModeOverlay = ({
  enabled,
  onToggle,
  context,
}) => {
  return (
    <Card elevation={4} className="mb-3">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Teaching Mode</Typography>
            <Chip
              label={enabled ? "ON" : "OFF"}
              color={enabled ? "success" : "default"}
              size="small"
            />
          </Stack>
        }
        subheader="Get step‑by‑step explanations of why fragmentation happens and how defragmentation fixes it."
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Off</Typography>
            <Switch checked={enabled} onChange={onToggle} />
            <Typography variant="body2">On</Typography>
          </Stack>
        }
      />
      {enabled && (
        <CardContent>
          <Alert severity="info" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {context.lastAction ?? "Start interacting with the simulator."}
            </Typography>
            {context.detail && (
              <Typography variant="body2" gutterBottom>
                {context.detail}
              </Typography>
            )}
            {context.tip && (
              <Typography variant="caption" color="text.secondary">
                Tip: {context.tip}
              </Typography>
            )}
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

