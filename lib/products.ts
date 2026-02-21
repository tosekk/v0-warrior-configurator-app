export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  type: 'item' | 'bundle' | 'complete_bundle'
  race?: 'human' | 'goblin'
  slot?: 'helmet' | 'armor' | 'weapon' | 'facial_hair'
  itemId?: string
  bundleItems?: string[] // Item IDs included in the bundle
}

// All products for the warrior configurator
// Individual items are $1.99
// Themed bundles (3 items: helmet + armor + weapon) are $4.99
// Complete bundles (all 8 items for a race) are $23.99
export const PRODUCTS: Product[] = [
  // Human Items - Helmets
  {
    id: 'human-helmet-basic',
    name: 'Human Basic Helmet',
    description: 'A simple iron helmet for human warriors',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'helmet',
    itemId: 'basic'
  },
  {
    id: 'human-helmet-knight',
    name: 'Human Knight Helmet',
    description: 'A noble knight\'s helmet with plume',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'helmet',
    itemId: 'knight'
  },
  
  // Human Items - Armor
  {
    id: 'human-armor-leather',
    name: 'Human Leather Armor',
    description: 'Lightweight leather armor for agility',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'armor',
    itemId: 'leather'
  },
  {
    id: 'human-armor-plate',
    name: 'Human Plate Armor',
    description: 'Heavy plate armor for maximum protection',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'armor',
    itemId: 'plate'
  },
  
  // Human Items - Weapons
  {
    id: 'human-weapon-sword',
    name: 'Human Longsword',
    description: 'A classic longsword for human warriors',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'weapon',
    itemId: 'sword'
  },
  {
    id: 'human-weapon-axe',
    name: 'Human Battle Axe',
    description: 'A powerful two-handed battle axe',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'weapon',
    itemId: 'axe'
  },
  
  // Human Items - Facial Hair
  {
    id: 'human-beard-full',
    name: 'Human Full Beard',
    description: 'A magnificent full beard',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'facial_hair',
    itemId: 'full'
  },
  {
    id: 'human-beard-goatee',
    name: 'Human Goatee',
    description: 'A stylish goatee',
    priceInCents: 199,
    type: 'item',
    race: 'human',
    slot: 'facial_hair',
    itemId: 'goatee'
  },
  
  // Goblin Items - Helmets
  {
    id: 'goblin-helmet-crude',
    name: 'Goblin Crude Helmet',
    description: 'A makeshift helmet for goblin warriors',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'helmet',
    itemId: 'crude'
  },
  {
    id: 'goblin-helmet-spiked',
    name: 'Goblin Spiked Helmet',
    description: 'A menacing spiked helmet',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'helmet',
    itemId: 'spiked'
  },
  
  // Goblin Items - Armor
  {
    id: 'goblin-armor-scrap',
    name: 'Goblin Scrap Armor',
    description: 'Armor made from scavenged materials',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'armor',
    itemId: 'scrap'
  },
  {
    id: 'goblin-armor-tribal',
    name: 'Goblin Tribal Armor',
    description: 'Traditional goblin tribal armor',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'armor',
    itemId: 'tribal'
  },
  
  // Goblin Items - Weapons
  {
    id: 'goblin-weapon-dagger',
    name: 'Goblin Rusty Dagger',
    description: 'A crude but effective dagger',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'weapon',
    itemId: 'dagger'
  },
  {
    id: 'goblin-weapon-club',
    name: 'Goblin Spiked Club',
    description: 'A brutal spiked club',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'weapon',
    itemId: 'club'
  },
  
  // Goblin Items - Facial Hair
  {
    id: 'goblin-beard-scraggly',
    name: 'Goblin Scraggly Beard',
    description: 'A wild, unkempt beard',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'facial_hair',
    itemId: 'scraggly'
  },
  {
    id: 'goblin-beard-braided',
    name: 'Goblin Braided Beard',
    description: 'A beard with tribal braids',
    priceInCents: 199,
    type: 'item',
    race: 'goblin',
    slot: 'facial_hair',
    itemId: 'braided'
  },
  
  // Themed Bundles - $4.99 (1 helmet + 1 armor + 1 weapon)
  {
    id: 'human-knight-set',
    name: 'Knight Set',
    description: 'Complete knight outfit: Knight Helmet + Plate Armor + Battle Axe',
    priceInCents: 499,
    type: 'bundle',
    race: 'human',
    bundleItems: ['human-helmet-knight', 'human-armor-plate', 'human-weapon-axe']
  },
  {
    id: 'goblin-raider-set',
    name: 'Raider Set',
    description: 'Complete raider outfit: Spiked Helmet + Tribal Armor + Spiked Club',
    priceInCents: 499,
    type: 'bundle',
    race: 'goblin',
    bundleItems: ['goblin-helmet-spiked', 'goblin-armor-tribal', 'goblin-weapon-club']
  },
  
  // Complete Bundles - $23.99 (unlock everything for a race)
  {
    id: 'human-complete-bundle',
    name: 'Human Warrior Complete Bundle',
    description: 'Unlock all customization options for human warriors',
    priceInCents: 2399,
    type: 'complete_bundle',
    race: 'human'
  },
  {
    id: 'goblin-complete-bundle',
    name: 'Goblin Warrior Complete Bundle',
    description: 'Unlock all customization options for goblin warriors',
    priceInCents: 2399,
    type: 'complete_bundle',
    race: 'goblin'
  }
]

// Helper to get product by ID
export function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id)
}

// Helper to get products by race
export function getProductsByRace(race: 'human' | 'goblin') {
  return PRODUCTS.filter(p => p.race === race)
}

// Helper to get items by slot
export function getItemsBySlot(race: 'human' | 'goblin', slot: string) {
  return PRODUCTS.filter(p => p.race === race && p.slot === slot && p.type === 'item')
}

// Helper to get themed bundle by race
export function getThemedBundleByRace(race: 'human' | 'goblin') {
  return PRODUCTS.find(p => p.race === race && p.type === 'bundle')
}

// Helper to get complete bundle by race
export function getCompleteBundleByRace(race: 'human' | 'goblin') {
  return PRODUCTS.find(p => p.race === race && p.type === 'complete_bundle')
}

// Helper to get all bundles by race (both themed and complete)
export function getAllBundlesByRace(race: 'human' | 'goblin') {
  return PRODUCTS.filter(p => p.race === race && (p.type === 'bundle' || p.type === 'complete_bundle'))
}
