export const defaultColors = [
  "#64b5f6",
  "#f06292",
  "#4db6ac",
  "#ba68c8",
  "#ffb74d",
  "#81c784",
  "#9575cd",
  "#e57373",
];

export function createInitialStorage(
  blockSizeKB = 4,
  totalBlocks = 256
) {
  return {
    blockSizeKB,
    totalBlocks,
    blocks: Array(totalBlocks).fill(null),
    files: [],
    history: [],
  };
}

export function computeFragments(blockIndices) {
  if (blockIndices.length === 0) return [];
  const sorted = [...blockIndices].sort((a, b) => a - b);
  const fragments = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      fragments.push({ start, length: prev - start + 1 });
      start = sorted[i];
      prev = sorted[i];
    }
  }
  fragments.push({ start, length: prev - start + 1 });
  return fragments;
}

export function computeStats(state) {
  const usedBlocks = state.blocks.filter((b) => b !== null).length;
  const freeBlocks = state.totalBlocks - usedBlocks;

  // fragmentation percent = blocks that are in fragmented files / used blocks
  let fragmentedBlocks = 0;
  for (const file of state.files) {
    const fragments = computeFragments(file.blocks);
    if (fragments.length > 1) {
      fragmentedBlocks += file.blocks.length;
    }
  }
  const fragmentationPercent =
    usedBlocks === 0 ? 0 : (fragmentedBlocks / usedBlocks) * 100;

  // largest contiguous free block
  let maxFree = 0;
  let currentFree = 0;
  for (let i = 0; i < state.totalBlocks; i++) {
    if (state.blocks[i] === null) {
      currentFree++;
      if (currentFree > maxFree) maxFree = currentFree;
    } else {
      currentFree = 0;
    }
  }

  // simple simulated access cost: average fragments per file
  let totalFragments = 0;
  for (const file of state.files) {
    totalFragments += computeFragments(file.blocks).length;
  }
  const simulatedAccessCost =
    state.files.length === 0 ? 1 : totalFragments / state.files.length;

  return {
    totalBlocks: state.totalBlocks,
    usedBlocks,
    freeBlocks,
    fragmentationPercent,
    largestContiguousFreeBlock: maxFree,
    simulatedAccessCost,
  };
}

export function allocateFileBlocks(
  state,
  blocksNeeded,
  strategy
) {
  const freeSegments = [];
  let currentStart = -1;
  let currentLen = 0;

  for (let i = 0; i < state.totalBlocks; i++) {
    if (state.blocks[i] === null) {
      if (currentStart === -1) currentStart = i;
      currentLen++;
    } else if (currentLen > 0) {
      freeSegments.push({ start: currentStart, length: currentLen });
      currentStart = -1;
      currentLen = 0;
    }
  }
  if (currentLen > 0) {
    freeSegments.push({ start: currentStart, length: currentLen });
  }

  if (strategy === "first-fit") {
    for (const seg of freeSegments) {
      if (seg.length >= blocksNeeded) {
        const blocks = [];
        for (let i = 0; i < blocksNeeded; i++) blocks.push(seg.start + i);
        return blocks;
      }
    }
  } else if (strategy === "best-fit") {
    let best = null;
    for (const seg of freeSegments) {
      if (seg.length >= blocksNeeded) {
        if (!best || seg.length < best.length) best = seg;
      }
    }
    if (best) {
      const blocks = [];
      for (let i = 0; i < blocksNeeded; i++) blocks.push(best.start + i);
      return blocks;
    }
  } else if (strategy === "random") {
    const freeBlockIndices = state.blocks
      .map((b, idx) => (b === null ? idx : -1))
      .filter((i) => i !== -1);
    if (freeBlockIndices.length < blocksNeeded) return null;
    const shuffled = [...freeBlockIndices].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, blocksNeeded);
  }

  return null;
}

export function defragment(state) {
  const newBlocks = Array(state.totalBlocks).fill(null);
  let cursor = 0;
  const newFiles = [];

  const sortedFiles = [...state.files].sort((a, b) => a.name.localeCompare(b.name));

  for (const file of sortedFiles) {
    const length = file.blocks.length;
    const newBlockIndices = [];
    for (let i = 0; i < length; i++) {
      if (cursor >= state.totalBlocks) break;
      newBlocks[cursor] = file.id;
      newBlockIndices.push(cursor);
      cursor++;
    }
    const fragments = computeFragments(newBlockIndices);
    newFiles.push({
      ...file,
      blocks: newBlockIndices,
      fragments,
    });
  }

  const nextState = {
    ...state,
    blocks: newBlocks,
    files: newFiles,
  };

  return nextState;
}

