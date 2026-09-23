const fs = require("fs");

const content = fs.readFileSync("raw_inventory.csv", "utf8").trim();
const lines = content.split("\n");

const items = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const parts = [];
  let cur = "";
  let inQuote = false;
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      parts.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  parts.push(cur.trim());

  const invNo = parts[0] || "";
  const name = parts[1] || "";
  const brand = parts[2] || "";
  const date = parts[3] || "";
  const loc = parts[4] || "";
  const madeIn = parts[5] || "";
  const cond = parts[6] || "";
  const qty = parts[7] || "1";
  const group = parts[8] || "";

  if (!name && !group && !invNo) continue;

  const upperLoc = loc.toUpperCase().replace(/\s+/g, "");
  let mappedLoc = "LAINNYA";
  if (upperLoc === "TW1") mappedLoc = "TW1";
  else if (upperLoc === "TW38") mappedLoc = "TW38";
  else if (upperLoc.includes("TEBET")) mappedLoc = "TEBET";
  else if (upperLoc.includes("TERJUAL")) mappedLoc = "TERJUAL";

  let mappedCond = "Normal";
  const lowerCond = cond.toLowerCase();
  if (lowerCond.includes("rusak")) mappedCond = "Rusak";
  else if (lowerCond.includes("terjual")) mappedCond = "Terjual";

  items.push({
    inventoryNo: invNo || `INV-${i}`,
    machineName: name || "Mesin Sewing",
    brand: brand || "-",
    purchaseDate: date || "-",
    location: mappedLoc,
    madeIn: madeIn || "-",
    condition: mappedCond,
    availableQty: parseInt(qty) || 1,
    machineGroup: group || "Lain-lain"
  });
}

// Generate the TypeScript file src/data/factoryMachineInventory.ts
const tsContent = `/**
 * Official Factory Machine Inventory Data
 * Parsed from factory equipment master data.
 *
 * Location Allocation Rules:
 * - Lokasi TW1  -> Peruntukan Line 1 & Line 3
 * - Lokasi TW38 -> Peruntukan Line 4, 5, 6, 7
 */

export interface MachineInventoryRecord {
  inventoryNo: string;
  machineName: string;
  brand: string;
  purchaseDate: string;
  location: "TW1" | "TW38" | "TEBET" | "TERJUAL" | "LAINNYA";
  madeIn: string;
  condition: "Normal" | "Rusak" | "Terjual";
  availableQty: number;
  machineGroup: string;
}

export const FACTORY_MACHINE_INVENTORY_RAW: MachineInventoryRecord[] = ${JSON.stringify(items, null, 2)};

export interface LocationGroupSummary {
  machineGroup: string;
  displayName: string;
  totalPabrik: number;
  normalTotal: number;
  tw1Normal: number;
  tw38Normal: number;
  rusakTotal: number;
  terjualTotal: number;
}

/**
 * Standard location allocation for lines:
 * Line 1, Line 3 -> TW1
 * Line 4, Line 5, Line 6, Line 7 -> TW38
 */
export function getLineFactoryLocation(lineId: number | string): "TW1" | "TW38" {
  const lineNum = typeof lineId === "number" ? lineId : parseInt(String(lineId).replace(/\\D/g, ""), 10);
  if (lineNum === 1 || lineNum === 3) {
    return "TW1";
  }
  return "TW38";
}

/**
 * Lines belonging to the same factory location
 */
export function getCoLocatedLines(lineId: number | string): number[] {
  const loc = getLineFactoryLocation(lineId);
  return loc === "TW1" ? [1, 3] : [4, 5, 6, 7];
}

/**
 * Build aggregated stock map per machine group and location
 */
export function getAggregatedMachineInventory(): Record<string, LocationGroupSummary> {
  const map: Record<string, LocationGroupSummary> = {};

  for (const item of FACTORY_MACHINE_INVENTORY_RAW) {
    const grp = item.machineGroup;
    if (!grp) continue;
    if (!map[grp]) {
      map[grp] = {
        machineGroup: grp,
        displayName: grp,
        totalPabrik: 0,
        normalTotal: 0,
        tw1Normal: 0,
        tw38Normal: 0,
        rusakTotal: 0,
        terjualTotal: 0,
      };
    }

    const qty = item.availableQty || 1;
    map[grp].totalPabrik += qty;

    if (item.condition === "Normal") {
      map[grp].normalTotal += qty;
      if (item.location === "TW1") {
        map[grp].tw1Normal += qty;
      } else if (item.location === "TW38") {
        map[grp].tw38Normal += qty;
      }
    } else if (item.condition === "Rusak") {
      map[grp].rusakTotal += qty;
    } else if (item.condition === "Terjual") {
      map[grp].terjualTotal += qty;
    }
  }

  return map;
}

/**
 * Get available normal machines for a specific line based on its factory location (TW1 or TW38).
 */
export function getAvailableStockForLine(machineGroup: string, lineId: number | string): number {
  const agg = getAggregatedMachineInventory();
  const summary = agg[machineGroup];
  if (!summary) return 0;
  const loc = getLineFactoryLocation(lineId);
  return loc === "TW1" ? summary.tw1Normal : summary.tw38Normal;
}
`;

fs.writeFileSync("src/data/factoryMachineInventory.ts", tsContent);
console.log("Successfully generated src/data/factoryMachineInventory.ts with", items.length, "records");
