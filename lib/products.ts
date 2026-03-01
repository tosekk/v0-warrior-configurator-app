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
    | "shield"
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
    id: "human-base-default",
    name: "Human Warrior Base",
    description: "Base human warrior model",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "base",
    itemId: "human_base_default",
    storagePath: "human/base_default.glb",
  },
  {
    id: "human-base-stretched-hand",
    name: "Human Warrior Base",
    description: "Base human warrior model",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "base",
    itemId: "human_base_stretched_hand",
    storagePath: "human/base_stretched_hand.glb",
  },
  {
    id: "goblin-base-default",
    name: "Goblin Warrior Base",
    description: "Base goblin warrior model",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "base",
    itemId: "goblin_base_default",
    storagePath: "goblin/base_default.glb",
  },
  {
    id: "goblin-base-stretched-hand",
    name: "Goblin Warrior Base",
    description: "Base goblin warrior model",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "base",
    itemId: "goblin_base_stretched_hand",
    storagePath: "goblin/base_stretched_hand.glb",
  },

  // Human Items - Free Weapons
  {
    id: "human-bat",
    name: "Human Bat",
    description: "A wooden bat",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "bat",
    storagePath: "human/free/bat.glb",
  },
  {
    id: "human-dagger",
    name: "Human Dagger",
    description: "A simple dagger",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "dagger",
    storagePath: "human/free/dagger.glb",
  },
  {
    id: "human-mace",
    name: "Human Mace",
    description: "A simple mace",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "mace",
    storagePath: "human/free/mace.glb",
  },
  {
    id: "human-spiky-bat",
    name: "Human Spiky Bat",
    description: "A wooden bat with spikes",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "spiky_bat",
    storagePath: "human/free/spiky_bat.glb",
  },
  {
    id: "human-spear",
    name: "Human Spear",
    description: "A wooden spear with metal tip",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "spear",
    storagePath: "human/free/spear.glb",
  },
  {
    id: "human-staff",
    name: "Human Staff",
    description: "A wooden staff",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "staff",
    storagePath: "human/free/staff.glb",
  },

  // Human Items - Free Shields
  {
    id: "human-tower-shield",
    name: "Human Tower Shield",
    description: "A tower shield",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shield",
    itemId: "tower_shield",
    storagePath: "human/free/tower_shield.glb",
  },
  {
    id: "human-round-shield",
    name: "Human Round Shield",
    description: "A round shield",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shield",
    itemId: "round_shield",
    storagePath: "human/free/round_shield.glb",
  },

  // Human Items - Archer Set
  {
    id: "human-archer-hood",
    name: "Human Archer Hood",
    description: "A simple hood for human archers",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "archer_hood",
    storagePath: "human/free/archer/archer_hood.glb",
  },
  {
    id: "human-archer-tunic",
    name: "Human Archer Tunic",
    description: "Lightweight leather and cloth chestplate for archers",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "chestplate",
    itemId: "archer_chestplate",
    storagePath: "human/free/archer/archer_tunic.glb",
  },
  {
    id: "human-archer-pants",
    name: "Human Archer Pants",
    description: "Simple pants",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "pants",
    itemId: "archer_pants",
    storagePath: "human/free/archer/archer_pants.glb",
  },
  {
    id: "human-archer-boots",
    name: "Human Archer Boots",
    description: "Simple leather boots",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shoes",
    itemId: "archer_shoes",
    storagePath: "human/free/archer/archer_boots.glb",
  },
  {
    id: "human-archer-bow",
    name: "Human Archer Bow",
    description: "Short Bow",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "archer_bow",
    storagePath: "human/free/archer/bow.glb",
  },

  // Human - Squire Set
  {
    id: "human-squire-helmet",
    name: "Human Squire Helmet",
    description: "A knight's squire's helmet",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "squire_helmet",
    storagePath: "human/free/squire/helmet.glb",
  },
  {
    id: "human-squire-vest",
    name: "Human Squire Vest",
    description: "Simple leather vest with metal pauldrons",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "chestplate",
    itemId: "squire_chestplate",
    storagePath: "human/free/squire/chestplate.glb",
  },
  {
    id: "human-squire-pants",
    name: "Human Squire Pants",
    description: "Simple pants with some reinforcement",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "pants",
    itemId: "squire_pants",
    storagePath: "human/free/squire/pants.glb",
  },
  {
    id: "human-squire-boots",
    name: "Human Squire Boots",
    description: "Simple leather boots with some reinforcement",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shoes",
    itemId: "squire_shoes",
    storagePath: "human/free/squire/shoes.glb",
  },
  {
    id: "human-squire-sword",
    name: "Human Longsword",
    description: "A classic longsword for human warriors",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "squire_sword",
    storagePath: "human/free/squire/sword.glb",
  },
  {
    id: "human-squire-shield",
    name: "Human Squire Shield",
    description: "A wooden shield",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shield",
    itemId: "squire_shield",
    storagePath: "human/free/squire/shield.glb",
  },

  // Human Items - Greek set
  {
    id: "human-greek-helmet",
    name: "Human Greek Helmet",
    description: "A greek helmet",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "helmet",
    itemId: "greek_helmet",
    storagePath: "human/paid/greek/helmet.glb",
  },
  {
    id: "human-greek-chestplate",
    name: "Human Greek Chestplate",
    description: "Greek chestplate with pauldrons and bracers",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "chestplate",
    itemId: "greek_chestplate",
    storagePath: "human/paid/greek/chestplate.glb",
  },
  {
    id: "human-greek-skirt",
    name: "Human Greek Skirt",
    description: "A greek skirt",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "pants",
    itemId: "greek_skirt",
    storagePath: "human/paid/greek/skirt.glb",
  },
  {
    id: "human-greek-boots",
    name: "Human Greek Boots",
    description: "Greek shoes",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shoes",
    itemId: "greek_shoes",
    storagePath: "human/paid/greek/shoes.glb",
  },
  {
    id: "human-greek-sword",
    name: "Human Greek Sword",
    description: "A greek sword",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "greek_sword",
    storagePath: "human/paid/greek/sword.glb",
  },
  {
    id: "human-greek-spear",
    name: "Human Greek Spear",
    description: "A greek spear",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "weapon",
    itemId: "greek_spear",
    storagePath: "human/paid/greek/spear.glb",
  },
  {
    id: "human-greek-shield",
    name: "Human Greek Shield",
    description: "A greek shield",
    priceInCents: 199,
    type: "item",
    race: "human",
    slot: "shield",
    itemId: "greek_shield",
    storagePath: "human/paid/greek/shield.glb",
  },

  // Goblin Items - Swiss Set
  {
    id: "goblin-swiss-helmet",
    name: "Goblin Swiss Helmet",
    description: "A swiss kettle helmet",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "helmet",
    itemId: "swiss_helmet",
    storagePath: "goblin/free/swiss/helmet.glb",
  },
  {
    id: "goblin-swiss-chestplate",
    name: "Goblin Swiss Chesplate",
    description: "A swiss chestplate",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "chestplate",
    itemId: "swiss_chestplate",
    storagePath: "goblin/free/swiss/chestplate.glb",
  },
  {
    id: "goblin-swiss-pants",
    name: "Goblin Swiss Pants",
    description: "A swiss pants",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "pants",
    itemId: "swiss_pants",
    storagePath: "goblin/free/swiss/pants.glb",
  },
  {
    id: "goblin-swiss-boots",
    name: "Goblin Swiss Boots",
    description: "A pair of swiss boots",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "shoes",
    itemId: "swiss_shoes",
    storagePath: "goblin/free/swiss/shoes.glb",
  },
  {
    id: "goblin-swiss-halberd",
    name: "Goblin Swiss Halberd",
    description: "A swiss halberd",
    priceInCents: 199,
    type: "item",
    race: "goblin",
    slot: "weapon",
    itemId: "swiss_halberd",
    storagePath: "goblin/free/swiss/halberd.glb",
  },

  // Themed Bundles - $4.99 (1 helmet + 1 chestplate + 1 weapon)
  // Bundles have no storagePath — their models are resolved from bundleItems
  {
    id: "human-greek-set",
    name: "Greek Set",
    description: "Complete greek outfit",
    priceInCents: 699,
    type: "bundle",
    race: "human",
    bundleItems: [
      "human-greek-helmet",
      "human-greek-chestplate",
      "human-greek-skirt",
      "human-greek-boots",
      "human-greek-spear",
      "human-greek-sword",
      "human-greek-shield",
    ],
  },
  // {
  //   id: "goblin-raider-set",
  //   name: "Raider Set",
  //   description:
  //     "Complete raider outfit: Spiked Helmet + Tribal chestplate + Spiked Club",
  //   priceInCents: 499,
  //   type: "bundle",
  //   race: "goblin",
  //   bundleItems: [
  //     "goblin-helmet-spiked",
  //     "goblin-chestplate-tribal",
  //     "goblin-weapon-club",
  //   ],
  // },

  // Complete Bundles - $23.99 (unlock everything for a race)
  // {
  //   id: "human-complete-bundle",
  //   name: "Human Warrior Complete Bundle",
  //   description: "Unlock all customization options for human warriors",
  //   priceInCents: 2399,
  //   type: "complete_bundle",
  //   race: "human",
  // },
  // {
  //   id: "goblin-complete-bundle",
  //   name: "Goblin Warrior Complete Bundle",
  //   description: "Unlock all customization options for goblin warriors",
  //   priceInCents: 2399,
  //   type: "complete_bundle",
  //   race: "goblin",
  // },
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

export type PoseType = "default" | "stretched_hand";

export const WEAPON_POSE_MAP: Record<string, PoseType> = {
  archer_bow: "default",
  squire_sword: "stretched_hand",
  bat: "stretched_hand",
  dagger: "stretched_hand",
  mace: "stretched_hand",
  spiky_bat: "stretched_hand",
  spear: "stretched_hand",
  staff: "stretched_hand",
  swiss_halberd: "stretched_hand",
  greek_sword: "stretched_hand",
  greek_spear: "stretched_hand",
};

export function getWeaponPose(weaponItemId: string): PoseType {
  return WEAPON_POSE_MAP[weaponItemId] ?? "default";
}

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
export function resolveBaseModelUrl(
  race: "human" | "goblin",
  weaponItemId: string = "none",
): string | null {
  const pose = getWeaponPose(weaponItemId);
  const product = PRODUCTS.find(
    (p) =>
      p.race === race && p.slot === "base" && p.id === `${race}_base_${pose}`,
  );
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
    shield: string;
    facialHair: string;
    mount: string;
  },
): {
  helmet: string | null;
  chestplate: string | null;
  pants: string | null;
  shoes: string | null;
  weapon: string | null;
  shield: string | null;
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
      | "shield"
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
    shield: urlForSlot("shield", config.shield),
    facialHair: urlForSlot("facial_hair", config.facialHair),
    mount: urlForSlot("mount", config.mount),
  };
}

// ─── Product Lookup Helpers ───────────────────────────────────────────────────
//
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
