import dropTestDataset from "../../Drop_Test_Validation_Dataset.json";

export type DropTestSKU = typeof dropTestDataset[0];

export function findMatchingSKU(params: {
  weight_g: number;
  height_cm: number;
  straps: { head: boolean; waist: boolean; arm: boolean; leg: boolean };
  center_of_gravity?: string;
  hasSmallAccessories?: boolean;
}): DropTestSKU {
  const isZeroStraps = !params.straps.head && !params.straps.waist && !params.straps.arm && !params.straps.leg;
  const activeStrapCount = [params.straps.head, params.straps.waist, params.straps.arm, params.straps.leg].filter(Boolean).length;

  let bestMatch = dropTestDataset[0];
  let bestScore = -Infinity;

  for (const item of dropTestDataset) {
    let score = 0;
    
    // Heavy weight for exact 4-strap match vs 0-strap match
    const itemStrapCount = [item.straps.head, item.straps.waist, item.straps.arm, item.straps.leg].filter(Boolean).length;

    if (isZeroStraps) {
      if (itemStrapCount === 0) score += 500; // Enforce matching a zero-strap benchmark item
      else score -= 300;
    } else {
      // Reward exact 4-strap pattern match
      const exactStrapMatch = 
        item.straps.head === params.straps.head &&
        item.straps.waist === params.straps.waist &&
        item.straps.arm === params.straps.arm &&
        item.straps.leg === params.straps.leg;

      if (exactStrapMatch) {
        score += 500; // Heavy bonus for exact strap configuration match
      } else {
        if (item.straps.head === params.straps.head) score += 50;
        if (item.straps.waist === params.straps.waist) score += 50;
        if (item.straps.arm === params.straps.arm) score += 30;
        if (item.straps.leg === params.straps.leg) score += 30;
      }
    }

    // Weight proximity
    const weightDiff = Math.abs(item.weight_g - params.weight_g);
    score -= weightDiff * 0.1;

    // Height proximity
    const heightDiff = Math.abs(item.height_cm - params.height_cm);
    score -= heightDiff * 0.5;

    // Center of gravity match
    if (params.center_of_gravity && item.center_of_gravity.toLowerCase() === params.center_of_gravity.toLowerCase()) {
      score += 15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Override results if 0 straps applied to strictly reflect physical drop test laws
  if (isZeroStraps) {
    return {
      ...bestMatch,
      results: {
        master_carton_1_drop: "Fail",
        master_carton_10_drop: "Fail",
        sioc_1_drop: "Fail",
        sioc_17_drop: "Fail",
      },
      failure_details: "Zero attachment straps applied (0-Point Setup) — Toy shifted completely out of cavity on initial drop impact."
    };
  }

  return bestMatch;
}

export { dropTestDataset };
