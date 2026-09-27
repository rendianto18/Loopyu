import { CodeBlock, Direction, LevelConfig } from "../types";

export interface ExecutionStep {
  stepIndex: number;
  blockId: string;
  parentLoopId?: string;
  loopType?: "for" | "while" | "do_while";
  iteration?: number;
  totalIterations?: number;
  conditionText?: string;
  action: string;
  robotPos: { x: number; y: number; dir: Direction };
  collectedBatteryIds: string[];
  isCrashed?: boolean;
  crashReason?: string;
  isInfiniteLoop?: boolean;
}

export interface EngineResult {
  steps: ExecutionStep[];
  success: boolean;
  crashed: boolean;
  infiniteLoop: boolean;
  crashReason?: string;
  collectedBatteryIds: string[];
  totalBatteries: number;
  usedLoop: boolean;
  loopTypesUsed: ("for" | "while" | "do_while")[];
  conceptValid: boolean;
  conceptFeedback?: string;
  totalBlocksUsed: number;
  isEfficient: boolean;
}

export const DIRECTIONS_ORDER: Direction[] = ["right", "down", "left", "up"];

export function turnRobot(currDir: Direction, turnDir: "left" | "right"): Direction {
  const idx = DIRECTIONS_ORDER.indexOf(currDir);
  if (turnDir === "right") {
    return DIRECTIONS_ORDER[(idx + 1) % 4];
  } else {
    return DIRECTIONS_ORDER[(idx + 3) % 4];
  }
}

export function getNextCoordinates(x: number, y: number, dir: Direction): { x: number; y: number } {
  switch (dir) {
    case "right":
      return { x: x + 1, y };
    case "left":
      return { x: x - 1, y };
    case "up":
      return { x, y: y - 1 };
    case "down":
      return { x, y: y + 1 };
  }
}

export function isBlocked(x: number, y: number, level: LevelConfig): boolean {
  if (x < 0 || x >= level.gridSize.cols || y < 0 || y >= level.gridSize.rows) {
    return true;
  }
  if (level.obstacles?.some((obs) => obs.x === x && obs.y === y)) {
    return true;
  }
  return false;
}

export function countTotalBlocks(blocks: CodeBlock[]): number {
  let count = 0;
  for (const b of blocks) {
    count++;
    if (b.type === "repeat" || b.type === "while" || b.type === "do_while" || b.type === "if") {
      count += countTotalBlocks(b.commands);
    }
  }
  return count;
}

/**
 * Executes a program and produces an array of detailed animation steps with loop iteration tracking.
 */
export function simulateLoopProgram(blocks: CodeBlock[], level: LevelConfig): EngineResult {
  const steps: ExecutionStep[] = [];
  let curX = level.startPos.x;
  let curY = level.startPos.y;
  let curDir = level.startPos.dir;
  const collected = new Set<string>();

  let isCrashed = false;
  let crashReason = "";
  let isInfiniteLoop = false;
  const loopTypesUsed = new Set<"for" | "while" | "do_while">();

  const MAX_TOTAL_STEPS = 90;
  const MAX_LOOP_ITERATIONS = 40;

  function evalCondition(
    condition: "path_clear" | "has_battery" | "not_at_target" | "energy_gt_zero"
  ): boolean {
    if (condition === "path_clear") {
      const next = getNextCoordinates(curX, curY, curDir);
      return !isBlocked(next.x, next.y, level);
    }
    if (condition === "has_battery") {
      return level.targetBatteries.some((b) => b.x === curX && b.y === curY && !collected.has(b.id));
    }
    if (condition === "not_at_target") {
      return collected.size < level.targetBatteries.length;
    }
    if (condition === "energy_gt_zero") {
      return true;
    }
    return false;
  }

  // Recursive block executor
  function executeBlockList(
    subList: CodeBlock[],
    parentLoop?: {
      id: string;
      type: "for" | "while" | "do_while";
      iteration: number;
      total: number;
      conditionText?: string;
    }
  ): "break" | "continue" | "normal" {
    for (const block of subList) {
      if (steps.length >= MAX_TOTAL_STEPS) {
        isInfiniteLoop = true;
        return "normal";
      }
      if (isCrashed || isInfiniteLoop) return "normal";

      if (block.type === "command") {
        if (block.action === "move_forward") {
          const next = getNextCoordinates(curX, curY, curDir);
          if (isBlocked(next.x, next.y, level)) {
            isCrashed = true;
            crashReason = "Robot menabrak pembatas arena atau rintangan. Coba periksa urutan blokmu.";
            steps.push({
              stepIndex: steps.length + 1,
              blockId: block.id,
              parentLoopId: parentLoop?.id,
              loopType: parentLoop?.type,
              iteration: parentLoop?.iteration,
              totalIterations: parentLoop?.total,
              conditionText: parentLoop?.conditionText,
              action: "move_forward",
              robotPos: { x: curX, y: curY, dir: curDir },
              collectedBatteryIds: Array.from(collected),
              isCrashed: true,
              crashReason,
            });
            return "normal";
          } else {
            curX = next.x;
            curY = next.y;

            // In Level 3 (staircase traversal) or levels without take_battery, auto-collect battery upon reaching target tile
            if (!level.allowedBlocks.includes("take_battery") || level.id === 3 || level.id === 4) {
              const found = level.targetBatteries.find(
                (b) => b.x === curX && b.y === curY && !collected.has(b.id)
              );
              if (found) {
                collected.add(found.id);
              }
            }

            steps.push({
              stepIndex: steps.length + 1,
              blockId: block.id,
              parentLoopId: parentLoop?.id,
              loopType: parentLoop?.type,
              iteration: parentLoop?.iteration,
              totalIterations: parentLoop?.total,
              conditionText: parentLoop?.conditionText,
              action: "move_forward",
              robotPos: { x: curX, y: curY, dir: curDir },
              collectedBatteryIds: Array.from(collected),
            });
          }
        } else if (block.action === "turn_left") {
          curDir = turnRobot(curDir, "left");
          steps.push({
            stepIndex: steps.length + 1,
            blockId: block.id,
            parentLoopId: parentLoop?.id,
            loopType: parentLoop?.type,
            iteration: parentLoop?.iteration,
            totalIterations: parentLoop?.total,
            conditionText: parentLoop?.conditionText,
            action: "turn_left",
            robotPos: { x: curX, y: curY, dir: curDir },
            collectedBatteryIds: Array.from(collected),
          });
        } else if (block.action === "turn_right") {
          curDir = turnRobot(curDir, "right");
          steps.push({
            stepIndex: steps.length + 1,
            blockId: block.id,
            parentLoopId: parentLoop?.id,
            loopType: parentLoop?.type,
            iteration: parentLoop?.iteration,
            totalIterations: parentLoop?.total,
            conditionText: parentLoop?.conditionText,
            action: "turn_right",
            robotPos: { x: curX, y: curY, dir: curDir },
            collectedBatteryIds: Array.from(collected),
          });
        } else if (block.action === "take_battery") {
          const found = level.targetBatteries.find(
            (b) => b.x === curX && b.y === curY && !collected.has(b.id)
          );
          if (found) {
            collected.add(found.id);
          }
          steps.push({
            stepIndex: steps.length + 1,
            blockId: block.id,
            parentLoopId: parentLoop?.id,
            loopType: parentLoop?.type,
            iteration: parentLoop?.iteration,
            totalIterations: parentLoop?.total,
            conditionText: parentLoop?.conditionText,
            action: "take_battery",
            robotPos: { x: curX, y: curY, dir: curDir },
            collectedBatteryIds: Array.from(collected),
          });
        } else if (block.action === "wait") {
          steps.push({
            stepIndex: steps.length + 1,
            blockId: block.id,
            parentLoopId: parentLoop?.id,
            loopType: parentLoop?.type,
            iteration: parentLoop?.iteration,
            totalIterations: parentLoop?.total,
            conditionText: parentLoop?.conditionText,
            action: "wait",
            robotPos: { x: curX, y: curY, dir: curDir },
            collectedBatteryIds: Array.from(collected),
          });
        }
      } else if (block.type === "repeat") {
        loopTypesUsed.add("for");
        const count = Math.max(1, Math.min(25, block.count || 3));
        for (let iter = 1; iter <= count; iter++) {
          if (steps.length >= MAX_TOTAL_STEPS || isCrashed) break;
          const conditionText = `i = ${iter - 1}, i < ${count} ✓`;
          const res = executeBlockList(block.commands, {
            id: block.id,
            type: "for",
            iteration: iter,
            total: count,
            conditionText,
          });
          if (res === "break") break;
        }
      } else if (block.type === "while") {
        loopTypesUsed.add("while");
        let whileCount = 0;
        while (evalCondition(block.condition) && whileCount < MAX_LOOP_ITERATIONS) {
          whileCount++;
          if (steps.length >= MAX_TOTAL_STEPS || isCrashed) break;
          const conditionText = `pathClear() ✓ TRUE`;
          const res = executeBlockList(block.commands, {
            id: block.id,
            type: "while",
            iteration: whileCount,
            total: 0,
            conditionText,
          });
          if (res === "break") break;
        }

        if (whileCount >= MAX_LOOP_ITERATIONS) {
          isInfiniteLoop = true;
          crashReason = "Terdeteksi infinite loop: kondisi while selalu bernilai true.";
        } else if (!isCrashed && steps.length > 0) {
          // Record final condition evaluation when while loop terminates
          const lastStep = steps[steps.length - 1];
          steps.push({
            stepIndex: steps.length + 1,
            blockId: block.id,
            parentLoopId: block.id,
            loopType: "while",
            iteration: whileCount,
            totalIterations: 0,
            conditionText: "pathClear() ✕ FALSE → LOOP STOPPED",
            action: "wait",
            robotPos: { ...lastStep.robotPos },
            collectedBatteryIds: Array.from(collected),
          });
        }
      } else if (block.type === "do_while") {
        loopTypesUsed.add("do_while");
        let doCount = 0;
        do {
          doCount++;
          if (steps.length >= MAX_TOTAL_STEPS || isCrashed) break;
          const conditionText = `do...while (Iterasi ${doCount})`;
          const res = executeBlockList(block.commands, {
            id: block.id,
            type: "do_while",
            iteration: doCount,
            total: 0,
            conditionText,
          });
          if (res === "break") break;
        } while (evalCondition(block.condition) && doCount < MAX_LOOP_ITERATIONS);

        if (doCount >= MAX_LOOP_ITERATIONS) {
          isInfiniteLoop = true;
          crashReason = "Terdeteksi infinite loop di do...while.";
        }
      } else if (block.type === "break") {
        steps.push({
          stepIndex: steps.length + 1,
          blockId: block.id,
          parentLoopId: parentLoop?.id,
          loopType: parentLoop?.type,
          iteration: parentLoop?.iteration,
          totalIterations: parentLoop?.total,
          conditionText: parentLoop?.conditionText,
          action: "break",
          robotPos: { x: curX, y: curY, dir: curDir },
          collectedBatteryIds: Array.from(collected),
        });
        return "break";
      } else if (block.type === "continue") {
        steps.push({
          stepIndex: steps.length + 1,
          blockId: block.id,
          parentLoopId: parentLoop?.id,
          loopType: parentLoop?.type,
          iteration: parentLoop?.iteration,
          totalIterations: parentLoop?.total,
          conditionText: parentLoop?.conditionText,
          action: "continue",
          robotPos: { x: curX, y: curY, dir: curDir },
          collectedBatteryIds: Array.from(collected),
        });
        return "continue";
      } else if (block.type === "if") {
        let condMet = false;
        if (block.condition === "at_target") {
          condMet = level.targetBatteries.some((b) => b.x === curX && b.y === curY);
        } else if (block.condition === "path_clear") {
          const next = getNextCoordinates(curX, curY, curDir);
          condMet = !isBlocked(next.x, next.y, level);
        } else if (block.condition === "has_battery") {
          condMet = level.targetBatteries.some((b) => b.x === curX && b.y === curY && !collected.has(b.id));
        }

        if (condMet) {
          const res = executeBlockList(block.commands, parentLoop);
          if (res === "break" || res === "continue") return res;
        }
      }
    }
    return "normal";
  }

  executeBlockList(blocks);

  const collectedArray = Array.from(collected);
  const totalBatteries = level.targetBatteries.length;
  const allCollected = collectedArray.length === totalBatteries;
  const totalBlocksUsed = countTotalBlocks(blocks);
  const usedLoop = loopTypesUsed.size > 0;
  const isEfficient = totalBlocksUsed <= level.maxBlocksForEfficiency;

  // Conceptual Validation
  let conceptValid = true;
  let conceptFeedback: string | undefined;

  if (level.requiredLoopType && level.requiredLoopType !== "none") {
    if (level.requiredLoopType === "for" && !loopTypesUsed.has("for")) {
      conceptValid = false;
      conceptFeedback = "Coba gunakan FOR pada level ini agar langkah robot berulang secara otomatis!";
    } else if (level.requiredLoopType === "while" && !loopTypesUsed.has("while")) {
      conceptValid = false;
      conceptFeedback = "Coba gunakan WHILE pada level ini agar robot berhenti sesuai kondisi jalan aman!";
    } else if (level.requiredLoopType === "do_while" && !loopTypesUsed.has("do_while")) {
      conceptValid = false;
      conceptFeedback = "Gunakan balok DO...WHILE untuk menyelesaikan level ini!";
    } else if (level.requiredLoopType === "any_loop" && !usedLoop) {
      conceptValid = false;
      conceptFeedback = "Level ini membutuhkan perulangan (FOR atau WHILE), bukan perintah berulang manual!";
    }
  }

  const success = allCollected && !isCrashed && !isInfiniteLoop && conceptValid;

  return {
    steps,
    success,
    crashed: isCrashed,
    infiniteLoop: isInfiniteLoop,
    crashReason: isInfiniteLoop ? "Loop tidak berhenti. Periksa kondisinya." : crashReason,
    collectedBatteryIds: collectedArray,
    totalBatteries,
    usedLoop,
    loopTypesUsed: Array.from(loopTypesUsed),
    conceptValid,
    conceptFeedback,
    totalBlocksUsed,
    isEfficient,
  };
}
