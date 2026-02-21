// Bucket name for all 3D model assets
// Expected folder structure in the bucket:
//   3d-models/
//     human/
//       helmet/basic.glb
//       helmet/knight.glb
//       armor/leather.glb
//       armor/plate.glb
//       weapon/sword.glb
//       weapon/axe.glb
//       facial_hair/full.glb
//       facial_hair/goatee.glb
//     goblin/
//       helmet/crude.glb
//       ...
const BUCKET = "3d-models";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  type: "item" | "bundle" | "complete_bundle";
  race?: "human" | "goblin";
  slot?: "base" | "helmet" | "armor" | "weapon" | "facial_hair";
  itemId?: string;
  bundleItems?: string[]; // Item IDs included in the bundle
  // Storage path within the bucket (only set for individual items with a 3D model)
  storagePath?: string;
}

// All products for the warrior configurator
// Individual items are $1.99
// Themed bundles (3 items: helmet + armor + weapon) are $4.99
// Complete bundles (all 8 items for a race) are $23.99
export const PRODUCTS: Product[] = [
  // Base models — one per race, always free, not purchasable
  {
    id: "human-base",
    name: "Human Warrior Base",
    description: "Base human warrior model",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "base",
    itemId: "base",
    storagePath: "human/base.glb",
  },
  {
    id: "goblin-base",
    name: "Goblin Warrior Base",
    description: "Base goblin warrior model",
    priceInCents: 0,
    type: "item",
    race: "goblin",
    slot: "base",
    itemId: "base",
    storagePath: "goblin/base.glb",
  },

  // Human Items - Helmets
  {
    id: "human-helmet-basic",
    name: "Human Basic Helmet",
    description: "A simple iron helmet for human warriors",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "basic",
    storagePath: "human/helmet/basic.glb",
  },
  {
    id: "human-helmet-knight",
    name: "Human Knight Helmet",
    description: "A noble knight's helmet with plume",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "knight",
    storagePath: "human/helmet/knight.glb",
  },

  // Human Items - Armor
  {
    id: "human-armor-leather",
    name: "Human Leather Armor",
    description: "Lightweight leather armor for agility",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "armor",
    itemId: "leather",
    storagePath: "human/armor/leather.glb",
  },
  {
    id: "human-armor-plate",
    name: "Human Plate Armor",
    description: "Heavy plate armor for maximum protection",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "armor",
    itemId: "plate",
    storagePath: "human/armor/plate.glb",
  },

  // Human Items - Weapons
  {
    id: "human-weapon-sword",
    name: "Human Longsword",
    description: "A classic longsword for human warriors",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "sword",
    storagePath: "human/weapon/sword.glb",
  },
  {
    id: "human-weapon-axe",
    name: "Human Battle Axe",
    description: "A powerful two-handed battle axe",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "axe",
    storagePath: "human/weapon/axe.glb",
  },

  // Human Items - Facial Hair
  {
    id: "human-beard-full",
    name: "Human Full Beard",
    description: "A magnificent full beard",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "facial_hair",
    itemId: "full",
    storagePath: "human/facial_hair/full.glb",
  },
  {
    id: "human-beard-goatee",
    name: "Human Goatee",
    description: "A stylish goatee",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "facial_hair",
    itemId: "goatee",
    storagePath: "human/facial_hair/goatee.glb",
  },

  // Goblin Items - Helmets
  {
    id: "goblin-helmet-crude",
    name: "Goblin Crude Helmet",
    description: "A makeshift helmet for goblin warriors",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "helmet",
    itemId: "crude",
    storagePath: "goblin/helmet/crude.glb",
  },
  {
    id: "goblin-helmet-spiked",
    name: "Goblin Spiked Helmet",
    description: "A menacing spiked helmet",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "helmet",
    itemId: "spiked",
    storagePath: "goblin/helmet/spiked.glb",
  },

  // Goblin Items - Armor
  {
    id: "goblin-armor-scrap",
    name: "Goblin Scrap Armor",
    description: "Armor made from scavenged materials",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "armor",
    itemId: "scrap",
    storagePath: "goblin/armor/scrap.glb",
  },
  {
    id: "goblin-armor-tribal",
    name: "Goblin Tribal Armor",
    description: "Traditional goblin tribal armor",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "armor",
    itemId: "tribal",
    storagePath: "goblin/armor/tribal.glb",
  },

  // Goblin Items - Weapons
  {
    id: "goblin-weapon-dagger",
    name: "Goblin Rusty Dagger",
    description: "A crude but effective dagger",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "weapon",
    itemId: "dagger",
    storagePath: "goblin/weapon/dagger.glb",
  },
  {
    id: "goblin-weapon-club",
    name: "Goblin Spiked Club",
    description: "A brutal spiked club",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "weapon",
    itemId: "club",
    storagePath: "goblin/weapon/club.glb",
  },

  // Goblin Items - Facial Hair
  {
    id: "goblin-beard-scraggly",
    name: "Goblin Scraggly Beard",
    description: "A wild, unkempt beard",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "facial_hair",
    itemId: "scraggly",
    storagePath: "goblin/facial_hair/scraggly.glb",
  },
  {
    id: "goblin-beard-braided",
    name: "Goblin Braided Beard",
    description: "A beard with tribal braids",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "facial_hair",
    itemId: "braided",
    storagePath: "goblin/facial_hair/braided.glb",
  },

  // Themed Bundles - $4.99 (1 helmet + 1 armor + 1 weapon)
  // Bundles have no storagePath — their models are resolved from bundleItems
  {
    id: "human-knight-set",
    name: "Knight Set",
    description:
      "Complete knight outfit: Knight Helmet + Plate Armor + Battle Axe",
    priceInCents: 499,
    type: "bundle",
    race: "human",
    bundleItems: [
      "human-helmet-knight",
      "human-armor-plate",
      "human-weapon-axe",
    ],
  },
  {
    id: "goblin-raider-set",
    name: "Raider Set",
    description:
      "Complete raider outfit: Spiked Helmet + Tribal Armor + Spiked Club",
    priceInCents: 499,
    type: "bundle",
    race: "goblin",
    bundleItems: [
      "goblin-helmet-spiked",
      "goblin-armor-tribal",
      "goblin-weapon-club",
    ],
  },

  // Complete Bundles - $23.99 (unlock everything for a race)
  {
    id: "human-complete-bundle",
    name: "Human Warrior Complete Bundle",
    description: "Unlock all customization options for human warriors",
    priceInCents: 2399,
    type: "complete_bundle",
    race: "human",
  },
  {
    id: "goblin-complete-bundle",
    name: "Goblin Warrior Complete Bundle",
    description: "Unlock all customization options for goblin warriors",
    priceInCents: 2399,
    type: "complete_bundle",
    race: "goblin",
  },
];

// ─── Storage Helpers ──────────────────────────────────────────────────────────
//
// Two variants are provided:
//
// getPublicModelUrl(product)
//   — Client-safe. Constructs the public URL directly from the env var.
//     Use this in 'use client' components like page.tsx.
//     Requires the bucket to be public.
//
// getModelUrl(product, supabase)
//   — Server-only. Uses a cookie-aware server client (from server.ts).
//     Use this in Server Components or Route Handlers.
//     Works for both public and private buckets.

/**
 * Client-safe public URL helper — no Supabase client required.
 * Builds the URL directly from NEXT_PUBLIC_SUPABASE_URL.
 * Only works when the bucket is set to public in Supabase Storage.
 */
export function getPublicModelUrl(product: Product): string | null {
  if (!product.storagePath) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${product.storagePath}`;
}

/**
 * Resolves the base body model URL for a given race.
 * Safe to call from 'use client' components.
 */
export function resolveBaseModelUrl(race: "human" | "goblin"): string | null {
  const product = PRODUCTS.find((p) => p.race === race && p.slot === "base");
  return product ? getPublicModelUrl(product) : null;
}

/**
 * Resolves a full set of model URLs for the current warrior config.
 * Returns null for any slot set to 'none' or with no matching product.
 * Safe to call from 'use client' components.
 */
export function resolveModelUrls(
  race: "human" | "goblin",
  config: { helmet: string; armor: string; weapon: string; facialHair: string },
): {
  helmet: string | null;
  armor: string | null;
  weapon: string | null;
  facialHair: string | null;
} {
  function urlForSlot(
    slot: "helmet" | "armor" | "weapon" | "facial_hair",
    itemId: string,
  ): string | null {
    if (itemId === "none") return null;
    const product = PRODUCTS.find(
      (p) =>
        p.race === race &&
        p.slot === slot &&
        p.itemId === itemId &&
        p.type === "item",
    );
    return product ? getPublicModelUrl(product) : null;
  }

  return {
    helmet: urlForSlot("helmet", config.helmet),
    armor: urlForSlot("armor", config.armor),
    weapon: urlForSlot("weapon", config.weapon),
    facialHair: urlForSlot("facial_hair", config.facialHair),
  };
}

// ─── Product Lookup Helpers ───────────────────────────────────────────────────

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByRace(race: "human" | "goblin") {
  return PRODUCTS.filter((p) => p.race === race);
}

export function getItemsBySlot(race: "human" | "goblin", slot: string) {
  return PRODUCTS.filter(
    (p) => p.race === race && p.slot === slot && p.type === "item",
  );
}

export function getThemedBundleByRace(race: "human" | "goblin") {
  return PRODUCTS.find((p) => p.race === race && p.type === "bundle");
}

export function getCompleteBundleByRace(race: "human" | "goblin") {
  return PRODUCTS.find((p) => p.race === race && p.type === "complete_bundle");
}

export function getAllBundlesByRace(race: "human" | "goblin") {
  return PRODUCTS.filter(
    (p) =>
      p.race === race && (p.type === "bundle" || p.type === "complete_bundle"),
  );
}
