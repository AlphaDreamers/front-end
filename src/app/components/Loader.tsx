"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";

const PHASE_TIME = 500;
const MAX_SPROUTS = 3;
const BRANCH_LENGTH = 20;
const DIRECTIONS = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

interface Point {
  x: number;
  y: number;
}

interface Node extends Point {
  sprouts: number;
}

interface Line {
  start: Point;
  end: Point;
  progress: number;
  phase: number;
}

// Helper function to check if two line segments intersect
function doLinesIntersect(
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): boolean {
  // If the lines share an endpoint, they don't "intersect" in the way we care about
  if (
    (Math.abs(line1Start.x - line2Start.x) < 1 &&
      Math.abs(line1Start.y - line2Start.y) < 1) ||
    (Math.abs(line1Start.x - line2End.x) < 1 &&
      Math.abs(line1Start.y - line2End.y) < 1) ||
    (Math.abs(line1End.x - line2Start.x) < 1 &&
      Math.abs(line1End.y - line2Start.y) < 1) ||
    (Math.abs(line1End.x - line2End.x) < 1 &&
      Math.abs(line1End.y - line2End.y) < 1)
  ) {
    return false;
  }

  // Calculate cross products for intersection detection
  function ccw(A: Point, B: Point, C: Point): boolean {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }

  // Two line segments intersect if and only if the orientation of the points changes
  return (
    ccw(line1Start, line2Start, line2End) !==
      ccw(line1End, line2Start, line2End) &&
    ccw(line1Start, line1End, line2Start) !==
      ccw(line1Start, line1End, line2End)
  );
}

// Function to check if a point is within the visible container bounds
function isWithinBounds(point: Point, width: number, height: number): boolean {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface LoaderProps {
  className?: string;
  color?: string;
}

export const Loader = ({ className, color }: LoaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<Node[]>([]);
  const lines = useRef<Line[]>([]);
  const phase = useRef<number>(0);
  const nextPhaseQueued = useRef<boolean>(false);
  const lastFrameTime = useRef<number>(0);

  useEffect(() => {
    const initializeGrowth = () => {
      // Clear any existing nodes/lines (for resizing case)
      nodes.current = [];
      lines.current = [];
      phase.current = 0;

      // Create two starting nodes - one at top left, one at bottom right
      const topLeftNode: Node = {
        x: 1, // A bit offset from the very edge
        y: 1,
        sprouts: 0,
      };

      nodes.current.push(topLeftNode);
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let start = performance.now();
    let frameId: number;

    // Initialize the canvas size
    const containerRect = canvasContainerRef.current!.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    // Initialize growth points
    initializeGrowth();

    const addSprouts = () => {
      const newNodes: Node[] = [];
      const newLines: Line[] = [];
      phase.current++;

      // Get nodes that can still sprout
      const candidates = nodes.current.filter((n) => n.sprouts < MAX_SPROUTS);

      if (candidates.length === 0) {
        // No candidates failure
        return false;
      }

      // Calculate weights for each candidate based on their existing sprout count
      const weightedCandidates = candidates.map((node) => {
        // Formula: MAX_SPROUTS + 1 - sprouts gives higher weight to nodes with fewer sprouts
        const weight = MAX_SPROUTS + 1 - node.sprouts;
        return { node, weight };
      });

      // Calculate the total weight
      const totalWeight = weightedCandidates.reduce(
        (acc, { weight }) => acc + weight,
        0
      );

      // Determine how many roots to select using logarithmic scaling
      const rootCount = Math.min(
        1 + Math.floor(Math.log2(nodes.current.length + 1)),
        candidates.length
      );

      // Select roots based on their weights
      const selectedRoots: Node[] = [];
      for (let i = 0; i < rootCount; i++) {
        if (weightedCandidates.length === 0) break;

        // Select a root based on weighted probability
        const random = Math.random() * totalWeight;
        let runningSum = 0;
        let selectedIndex = -1;

        for (let j = 0; j < weightedCandidates.length; j++) {
          runningSum += weightedCandidates[j].weight;
          if (random <= runningSum) {
            selectedIndex = j;
            break;
          }
        }

        // If we didn't select anything (shouldn't happen but just in case)
        if (selectedIndex === -1) {
          selectedIndex = 0;
        }

        // Add the selected root and remove it from candidates
        selectedRoots.push(weightedCandidates[selectedIndex].node);
        weightedCandidates.splice(selectedIndex, 1);
      }

      // For each selected root, try to find valid directions to sprout
      for (const root of selectedRoots) {
        // Get all available directions and shuffle them for randomness
        const availableDirs = [...DIRECTIONS];
        for (let i = availableDirs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableDirs[i], availableDirs[j]] = [
            availableDirs[j],
            availableDirs[i],
          ];
        }

        // Try to find valid directions for this root
        let sproutsAdded = 0;
        for (
          let i = 0;
          i < availableDirs.length && root.sprouts < MAX_SPROUTS;
          i++
        ) {
          const dir = availableDirs[i];

          // Using fixed branch length for all directions
          const end = {
            x: root.x + dir.x * BRANCH_LENGTH,
            y: root.y + dir.y * BRANCH_LENGTH,
          };

          // Check if the endpoint is within bounds
          if (!isWithinBounds(end, canvas.width, canvas.height)) {
            continue;
          }

          // Check if the endpoint overlaps with any existing node
          const endpointOverlaps = nodes.current.some(
            (n) => Math.abs(n.x - end.x) < 5 && Math.abs(n.y - end.y) < 5
          );

          if (endpointOverlaps) continue;

          // Check if this line would intersect with any existing line
          let lineCrosses = false;
          for (const line of lines.current) {
            if (doLinesIntersect(root, end, line.start, line.end)) {
              lineCrosses = true;
              break;
            }
          }

          if (lineCrosses) continue;

          // Also check against lines we're currently adding in this phase
          for (const line of newLines) {
            if (doLinesIntersect(root, end, line.start, line.end)) {
              lineCrosses = true;
              break;
            }
          }

          if (lineCrosses) continue;

          // This is a valid direction, so add the new node and line
          root.sprouts++;
          sproutsAdded++;

          newNodes.push({ x: end.x, y: end.y, sprouts: 0 });
          newLines.push({
            start: { ...root },
            end: { ...end },
            progress: 0,
            phase: phase.current,
          });

          // Limit to one new sprout per root per phase to avoid overcrowding
          if (sproutsAdded >= 1) break;
        }
      }

      // Add all new nodes and lines to their respective collections
      nodes.current.push(...newNodes);
      lines.current.push(...newLines);

      return newNodes.length > 0;
    };

    // Start the first phase immediately
    addSprouts();

    const draw = (timestamp: number) => {
      // Calculate delta time for smooth animations regardless of frame rate
      const deltaTime = timestamp - lastFrameTime.current;
      lastFrameTime.current = timestamp;

      // Throttle to avoid performance issues on high refresh rate monitors
      const dt = Math.min(deltaTime, 32) / 16; // Normalize to ~60fps

      // Handle canvas resizing if needed
      if (
        canvas.width !== canvasContainerRef.current!.clientWidth ||
        canvas.height !== canvasContainerRef.current!.clientHeight
      ) {
        canvas.width = canvasContainerRef.current!.clientWidth;
        canvas.height = canvasContainerRef.current!.clientHeight;
        initializeGrowth();
        addSprouts();
      }

      const elapsed = timestamp - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if all lines from current phase are complete
      let allLinesComplete = true;
      let activeLines = false;

      // Draw all lines with proper animation
      for (const line of lines.current) {
        if (line.progress < 1) {
          // Use delta time for consistent animation speed regardless of frame rate
          line.progress += 0.05 * dt;
          if (line.progress > 1) line.progress = 1;
          activeLines = true;
        }

        if (line.phase === phase.current && line.progress < 1) {
          allLinesComplete = false;
        }

        // Apply easing function for smooth animation
        const easedProgress = easeInOutCubic(line.progress);

        const x = line.start.x + (line.end.x - line.start.x) * easedProgress;
        const y = line.start.y + (line.end.y - line.start.y) * easedProgress;

        ctx.beginPath();
        ctx.strokeStyle = color || "rgb(0, 255, 192, 0.95)";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(0, 255, 192, 1)";
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Queue up the next phase slightly before this one completes
      if (
        elapsed >= PHASE_TIME &&
        allLinesComplete &&
        !nextPhaseQueued.current &&
        activeLines
      ) {
        nextPhaseQueued.current = true;

        // Use setTimeout to prepare the next phase during active animation
        setTimeout(() => {
          const success = addSprouts();
          nextPhaseQueued.current = false;
          start = timestamp;

          // If we couldn't add more lines, try once more after a delay
          if (!success && lines.current.length > 0) {
            setTimeout(() => {
              addSprouts();
            }, 500);
          }
        }, 0);
      }

      // If no animation is happening, try to start a new phase
      if (!activeLines && !nextPhaseQueued.current) {
        addSprouts();
        start = timestamp;
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current && canvasContainerRef.current) {
        canvas.width = canvasContainerRef.current.clientWidth;
        canvas.height = canvasContainerRef.current.clientHeight;
        initializeGrowth();
        addSprouts();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className={clsx("relative w-full h-full", className)}
      ref={canvasContainerRef}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
