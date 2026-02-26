import { PRODUCTS } from "./products";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates that all configuration items belong to the specified race
 */
export function validateRaceConfiguration(
  race: "human" | "goblin",
  config: {
    helmet: string;
    chestplate: string;
    pants: string;
    shoes: string;
    weapon: string;
    facialHair: string;
    mount: string;
  },
): ValidationResult {
  const errors: string[] = [];

  // Check each slot
  const slots = ["helmet", "chestplate", "weapon", "facial_hair"] as const;

  for (const slot of slots) {
    const configKey = slot === "facial_hair" ? "facialHair" : slot;
    const itemId = config[configKey as keyof typeof config];

    // Skip 'none' as it's always valid
    if (itemId === "none") continue;

    // Find the product that matches this configuration
    const product = PRODUCTS.find(
      (p) => p.race === race && p.slot === slot && p.itemId === itemId,
    );

    if (!product) {
      errors.push(`Invalid ${slot} item "${itemId}" for ${race} race`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that a user owns the specified items for their race
 */
export function validateItemOwnership(
  race: "human" | "goblin",
  config: {
    helmet: string;
    chestplate: string;
    pants: string;
    shoes: string;
    weapon: string;
    facialHair: string;
    mount: string;
  },
  ownedItems: string[],
): ValidationResult {
  const errors: string[] = [];

  // Free items per slot
  const freeItems = {
    helmet: ["none", "archer_hood", "squire_helmet"],
    chestplate: ["none", "archer_tunic", "squire_vest"],
    pants: ["none", "archer_pants", "squire_pants"],
    shoes: ["none", "archer_boots", "squrie_boots"],
    weapon: ["none", "sword"],
    facial_hair: ["none", "full"],
    mount: ["none"],
  };

  const slots = [
    "helmet",
    "chestplate",
    "pants",
    "shoes",
    "weapon",
    "facial_hair",
    "mount",
  ] as const;

  for (const slot of slots) {
    const configKey = slot === "facial_hair" ? "facialHair" : slot;
    const itemId = config[configKey as keyof typeof config];

    // Check if item is free
    if (freeItems[slot].includes(itemId)) continue;

    // Find the product
    const product = PRODUCTS.find(
      (p) => p.race === race && p.slot === slot && p.itemId === itemId,
    );

    if (product && !ownedItems.includes(product.id)) {
      errors.push(`You don't own the ${product.name}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a product ID belongs to a specific race
 */
export function isProductForRace(
  productId: string,
  race: "human" | "goblin",
): boolean {
  const product = PRODUCTS.find((p) => p.id === productId);
  return product?.race === race || false;
}
