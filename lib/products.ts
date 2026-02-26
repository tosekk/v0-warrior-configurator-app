// Bucket name for all 3D model assets
// Expected folder structure in the bucket:
//   3d-models/
//     human/
//       helmet/basic.glb
//       helmet/knight.glb
//       chestplate/leather.glb
//       chestplate/plate.glb
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
  slot?:
    | "base"
    | "helmet"
    | "chestplate"
    | "pants"
    | "shoes"
    | "weapon"
    | "facial_hair"
    | "mount";
  itemId?: string;
  bundleItems?: string[]; // Item IDs included in the bundle
  // Storage path within the bucket (only set for individual items with a 3D model)
  storagePath?: string;
}

// All products for the warrior configurator
// Individual items are $1.99
// Themed bundles (3 items: helmet + chestplate + weapon) are $4.99
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
    id: "human-archer-hood",
    name: "Human Archer Hood",
    description: "A simple hood for human archers",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "archer_hood",
    storagePath: "human/helmet/free/archer_hood.glb",
  },
  {
    id: "human-squire-helmet",
    name: "Human Squire Helmet",
    description: "A knight's squire's helmet",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "squire_helmet",
    storagePath: "human/helmet/free/squire_helmet.glb",
  },

  // Human Items - chestplate
  {
    id: "human-archer-tunic",
    name: "Human Archer Tunic",
    description: "Lightweight leather and cloth chestplate for archers",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "chestplate",
    itemId: "archer_tunic",
    storagePath: "human/chestplate/free/archer_tunic.glb",
  },
  {
    id: "human-squire-vest",
    name: "Human Squire Vest",
    description: "Simple leather vest with metal pauldrons",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "chestplate",
    itemId: "squire_vest",
    storagePath: "human/chestplate/free/squire_vest.glb",
  },

  // Human Items = pants
  {
    id: "human-archer-pants",
    name: "Human Archer Pants",
    description: "Simple pants",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "pants",
    itemId: "archer_pants",
    storagePath: "human/pants/free/archer_pants.glb",
  },
  {
    id: "human-squire-pants",
    name: "Human Squire Pants",
    description: "Simple pants with some reinforcement",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "pants",
    itemId: "squire_pants",
    storagePath: "human/pants/free/squire_pants.glb",
  },

  // Human Items - shoes
  {
    id: "human-archer-boots",
    name: "Human Archer Boots",
    description: "Simple leather boots",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "shoes",
    itemId: "archer_boots",
    storagePath: "human/shoes/free/archer_boots.glb",
  },
  {
    id: "human-quire-vest",
    name: "Human Squire Boots",
    description: "Simple leather boots with some reinforcement",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "shoes",
    itemId: "squire_boots",
    storagePath: "human/shoes/free/squire_boots.glb",
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
    storagePath: "human/weapon/free/sword.glb",
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
    storagePath: "human/weapon/free/axe.glb",
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
    storagePath: "human/facial_hair/free/full.glb",
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
    storagePath: "human/facial_hair/free/goatee.glb",
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
    storagePath: "goblin/helmet/free/crude.glb",
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
    storagePath: "goblin/helmet/free/spiked.glb",
  },

  // Goblin Items - chestplate
  {
    id: "goblin-chestplate-scrap",
    name: "Goblin Scrap chestplate",
    description: "chestplate made from scavenged materials",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "chestplate",
    itemId: "scrap",
    storagePath: "goblin/chestplate/free/scrap.glb",
  },
  {
    id: "goblin-chestplate-tribal",
    name: "Goblin Tribal chestplate",
    description: "Traditional goblin tribal chestplate",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "chestplate",
    itemId: "tribal",
    storagePath: "goblin/chestplate/free/tribal.glb",
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
    storagePath: "goblin/weapon/free/dagger.glb",
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
    storagePath: "goblin/weapon/free/club.glb",
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
    storagePath: "goblin/facial_hair/free/scraggly.glb",
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
    storagePath: "goblin/facial_hair/free/braided.glb",
  },

  // Themed Bundles - $4.99 (1 helmet + 1 chestplate + 1 weapon)
  // Bundles have no storagePath — their models are resolved from bundleItems
  {
    id: "human-knight-set",
    name: "Knight Set",
    description:
      "Complete knight outfit: Knight Helmet + Plate chestplate + Battle Axe",
    priceInCents: 499,
    type: "bundle",
    race: "human",
    bundleItems: [
      "human-helmet-knight",
      "human-chestplate-plate",
      "human-weapon-axe",
    ],
  },
  {
    id: "goblin-raider-set",
    name: "Raider Set",
    description:
      "Complete raider outfit: Spiked Helmet + Tribal chestplate + Spiked Club",
    priceInCents: 499,
    type: "bundle",
    race: "goblin",
    bundleItems: [
      "goblin-helmet-spiked",
      "goblin-chestplate-tribal",
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
  config: {
    helmet: string;
    chestplate: string;
    pants: string;
    shoes: string;
    weapon: string;
    facialHair: string;
    mount: string;
  },
): {
  helmet: string | null;
  chestplate: string | null;
  pants: string | null;
  shoes: string | null;
  weapon: string | null;
  facialHair: string | null;
  mount: string | null;
} {
  function urlForSlot(
    slot:
      | "helmet"
      | "chestplate"
      | "pants"
      | "shoes"
      | "weapon"
      | "facial_hair"
      | "mount",
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
    chestplate: urlForSlot("chestplate", config.chestplate),
    pants: urlForSlot("pants", config.pants),
    shoes: urlForSlot("shoes", config.shoes),
    weapon: urlForSlot("weapon", config.weapon),
    facialHair: urlForSlot("facial_hair", config.facialHair),
    mount: urlForSlot("mount", config.mount),
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
