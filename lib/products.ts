"use server";

import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

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
  storagePath?: string;
}

const BUCKET = "3d-models";
// All products for the warrior configurator
// Individual items are $1.99
// Themed bundles (3 items: helmet + armor + weapon) are $4.99
// Complete bundles (all 8 items for a race) are $23.99
export const PRODUCTS: Product[] = [
  // Base models - one per race, always free, not purchaseable
  {
    id: "human-base",
    name: "Human Warrior Base",
    description: "Base human warrior model",
    priceInCents: 0,
    type: "item",
    race: "human",
    slot: "base",
    itemId: "base",
    storagePath: "human/base.glb"
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
    storagePath: "goblin/base.glb"
  }
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
    storagePath: "human/weapon/battle_axe.glb",
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
    storagePath: "human/facial_hair/full_beard.glb",
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
    storagePath: "goblin/weapon/rusty_dagger.glb",
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
    storagePath: "goblin/weapon/beard_scraggly.glb",
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
    storagePath: "goblin/weapon/beard_braided.glb",
  },

  // Themed Bundles - $4.99 (1 helmet + 1 armor + 1 weapon)
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

export function getPublicModelUrl(product: Product): string | null {
  if (!product.storagePath) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${product.storagePath}`;
}

export function resolveBaseModelUrl(race: "human" | "goblin"): string | null {
  const product = PRODUCTS.find((p) => p.race === race && p.slot === "base");
  return product ? getPublicModelUrl(product) : null;
}

export function resolveModelUrls(race: 'human' | 'goblin', config: { helmet: string, armor: string, weapon: string, facialHair: string }): { helmet: string | null, armor: string | null, weapon: string | null, facialHair: string | null } {
  function urlForSlot(slot: 'helmet' | 'armor' | 'weapon' | 'facial_hair', itemId: string): string | null {
    if (itemId === 'none') return null
    const product = PRODUCTS.find(
      p => p.race === race && p.slot === slot && p.itemId === itemId && p.type === 'item'
    )
    return product ? getPublicModelUrl(product) : null
  }

  return {
    helmet: urlForSlot('helmet', config.helmet),
    armor: urlForSlot('armor', config.armor),
    weapon: urlForSlot('weapon', config.weapon),
    facialHair: urlForSlot('facial_hair', config.facialHair)
  }
}

export function getModelUrl(product: Product, supabase: SupabaseClient): string | null {
  if (!product.storagePath) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(product.storagePath)
  return data.publicUrl
}

// Helper to get product by ID
export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

// Helper to get products by race
export function getProductsByRace(race: "human" | "goblin") {
  return PRODUCTS.filter((p) => p.race === race);
}

// Helper to get items by slot
export function getItemsBySlot(race: "human" | "goblin", slot: string) {
  return PRODUCTS.filter(
    (p) => p.race === race && p.slot === slot && p.type === "item",
  );
}

// Helper to get themed bundle by race
export function getThemedBundleByRace(race: "human" | "goblin") {
  return PRODUCTS.find((p) => p.race === race && p.type === "bundle");
}

// Helper to get complete bundle by race
export function getCompleteBundleByRace(race: "human" | "goblin") {
  return PRODUCTS.find((p) => p.race === race && p.type === "complete_bundle");
}

// Helper to get all bundles by race (both themed and complete)
export function getAllBundlesByRace(race: "human" | "goblin") {
  return PRODUCTS.filter(
    (p) =>
      p.race === race && (p.type === "bundle" || p.type === "complete_bundle"),
  );
}
