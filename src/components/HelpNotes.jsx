import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography, useTheme, Paper, Divider, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorageIcon from "@mui/icons-material/Storage";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SpeedIcon from "@mui/icons-material/Speed";
import BuildIcon from "@mui/icons-material/Build";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import HelpIcon from "@mui/icons-material/Help";

const VisualBlock = ({ color = "#e2e8f0", label }) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      bgcolor: color,
      borderRadius: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      color: "rgba(0,0,0,0.6)",
      fontWeight: 'bold',
      border: "1px solid rgba(0,0,0,0.1)",
    }}
  >
    {label}
  </Box>
);

const DiagramContainer = ({ children, label }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: "#f1f5f9",
      borderRadius: 2,
      border: "1px dashed #cbd5e1",
      mt: 2,
      mb: 2,
    }}
  >
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
      {children}
    </Stack>
    <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#64748b", fontStyle: "italic" }}>
      {label}
    </Typography>
  </Paper>
);

const QuestionSection = ({ icon: Icon, question, children }) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: 'visible' }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#1e293b" gutterBottom>
            {question}
          </Typography>
          <Box sx={{ color: "#475569", lineHeight: 1.7 }}>
            {children}
          </Box>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export const HelpNotes = ({ onBack }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafbff", p: { xs: 2, md: 4 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>

          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                Help & Knowledge Base
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Everything you need to know about storage physics.
              </Typography>
            </Box>
            <Button
              onClick={onBack}
              startIcon={<ArrowBackIcon />}
              variant="contained"
              sx={{
                background: "white",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              Back
            </Button>
          </Stack>

          <Stack spacing={3}>

            {/* Q1 */}
            <QuestionSection icon={StorageIcon} question="1. What is Storage Fragmentation?">
              <Typography paragraph>
                Imagine your hard drive is a long row of lockers. Idealy, when you store a file, it sits in lockers 1, 2, and 3—right next to each other.
              </Typography>
              <Typography paragraph>
                <strong>Fragmentation</strong> happens when those lockers aren't available together. The computer has to put part of the file in locker 1, another part in locker 10, and the rest in locker 55. The file is broken into "fragments."
              </Typography>
              <DiagramContainer label="Fragmented File (Blue): Split into 3 non-contiguous parts">
                <VisualBlock color="#64b5f6" label="1" />
                <VisualBlock color="#64b5f6" label="2" />
                <VisualBlock color="#ffffff" label="Free" />
                <VisualBlock color="#ef4444" label="Used" />
                <VisualBlock color="#64b5f6" label="3" />
              </DiagramContainer>
            </QuestionSection>

            {/* Q2 */}
            <QuestionSection icon={HelpIcon} question="2. Why does Fragmentation occur?">
              <Typography paragraph>
                It happens naturally as you use your computer. When you create new files, they fill up free space. But when you <strong>delete</strong> or <strong>resize</strong> files, you create gaps (holes) in the storage map.
              </Typography>
              <Typography>
                Later, when you try to save a new large file, it might not fit into any single gap. The file system is forced to chop the file up to fit it into the small holes that are available.
              </Typography>
            </QuestionSection>

            {/* Q3 */}
            <QuestionSection icon={ViewModuleIcon} question="3. How does Allocation Strategy affect this?">
              <Typography paragraph>
                The OS has to decide <em>which</em> gap to use for a new file. This simulation lets you test three common strategies:
              </Typography>
              <ul>
                <li><strong>First Fit:</strong> Picks the very first gap that is big enough. It's fast but leaves small unusable gaps at the start of the drive.</li>
                <li><strong>Best Fit:</strong> Scans the <em>whole</em> drive to find the smallest gap that fits. It saves large spaces for later but is slower to calculate.</li>
                <li><strong>Random:</strong> Picks random free blocks. This is terrible for performance but demonstrates high fragmentation quickly!</li>
              </ul>
            </QuestionSection>

            {/* Q4 */}
            <QuestionSection icon={SpeedIcon} question="4. What is the Impact on Performance?">
              <Typography paragraph>
                <strong>Mechanical Hard Drives (HDD):</strong> A physical arm has to move to read data. If a file is in 100 places, the arm has to jump around 100 times. This causes slow boot times, lagging apps, and freezing.
              </Typography>
              <Typography>
                <strong>Solid State Drives (SSD):</strong> SSDs don't have moving parts, so the speed penalty is much lower. However, high fragmentation can still add logical overhead to the file system metadata and reduce the efficiency of writing data.
              </Typography>
            </QuestionSection>

            {/* Q5 */}
            <QuestionSection icon={BuildIcon} question="5. What is Defragmentation?">
              <Typography paragraph>
                Defragmentation is the process of reorganizing the drive. The computer picks up all the scattered pieces of files and rewrites them in a perfect, continuous line.
              </Typography>
              <Typography paragraph>
                It also pushes all the free space to the end of the drive, creating one giant empty block so future files don't get fragmented immediately.
              </Typography>
              <DiagramContainer label="Defragmented: All Blue blocks are consolidated">
                <VisualBlock color="#64b5f6" label="1" />
                <VisualBlock color="#64b5f6" label="2" />
                <VisualBlock color="#64b5f6" label="3" />
                <VisualBlock color="#ffffff" label="Free" />
                <VisualBlock color="#ffffff" label="Free" />
              </DiagramContainer>
            </QuestionSection>

            {/* Q6 */}
            <QuestionSection icon={AutoGraphIcon} question="6. Should I defrag my SSD?">
              <Typography paragraph>
                <strong>Generally, No.</strong> Traditional defragmentation (moving blocks to be contiguous) is unnecessary for SSDs because they have near-instant access times anywhere on the drive.
              </Typography>
              <Typography>
                In fact, defragging writes a lot of data, which can wear out the flash memory cells of an SSD faster. Modern OSs use a command called <strong>TRIM</strong> instead, which helps the SSD manage free space without moving data around excessively.
              </Typography>
            </QuestionSection>

            {/* Q7 */}
            <QuestionSection icon={QuestionAnswerIcon} question="7. How do I use this Simulator?">
              <Typography paragraph>
                1. <strong>Create Files:</strong> Use the panel on the right. Try making small files, then big ones.
              </Typography>
              <Typography paragraph>
                2. <strong>Create Gaps:</strong> Delete a few files from the middle of the map.
              </Typography>
              <Typography paragraph>
                3. <strong>Observe:</strong> Create a new large file. Notice how it gets split up (colored blocks in different places) to fill the gaps.
              </Typography>
              <Typography>
                4. <strong>Analyze & Defrag:</strong> Click "Analyze" to see your score, then "Defrag" to clean it all up!
              </Typography>
            </QuestionSection>

          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};
