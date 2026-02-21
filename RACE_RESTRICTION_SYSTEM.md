# Race Restriction System

## Overview

The Warrior Configurator implements a comprehensive race restriction system that ensures users can only access and save configurations with items that belong to their selected race (Human or Goblin).

## Key Features

### 1. Race-Specific Item Filtering

All items in the products catalog are tagged with a `race` property:

```typescript
{
  id: 'human-helmet-knight',
  name: 'Human Knight Helmet',
  race: 'human',
  slot: 'helmet',
  // ...
}
```

The `getItemsBySlot(race, slot)` helper function automatically filters items to only show those belonging to the current race.

### 2. Configuration Separation

Users can maintain separate configurations for each race:

- **Human Warrior Configuration**: Saved independently with human-specific items
- **Goblin Warrior Configuration**: Saved independently with goblin-specific items

When switching races, the system:
1. Shows a confirmation dialog warning about configuration reset
2. Loads the saved configuration for the target race (if it exists)
3. Filters owned items to only show purchases for that race
4. Resets to default if no saved configuration exists

### 3. Race Switch Confirmation

When users attempt to switch races, they see a confirmation dialog that:

- Warns them that current configuration will be reset
- Alerts if there are unsaved changes
- Explains that race-specific items and configurations are preserved
- Requires explicit confirmation before switching

```typescript
<RaceConfirmationDialog
  open={raceDialogOpen}
  onOpenChange={setRaceDialogOpen}
  onConfirm={confirmRaceChange}
  newRace={pendingRace}
  hasUnsavedChanges={hasUnsavedChanges}
/>
```

### 4. Server-Side Validation

Two validation functions ensure data integrity:

#### `validateRaceConfiguration(race, config)`

Validates that all items in a configuration belong to the specified race:

```typescript
const raceValidation = validateRaceConfiguration('human', {
  helmet: 'knight', // ✅ Valid for human
  armor: 'tribal',  // ❌ Invalid - belongs to goblin
  weapon: 'sword',
  facialHair: 'full'
})
// Returns: { valid: false, errors: ['Invalid armor item "tribal" for human race'] }
```

#### `validateItemOwnership(race, config, ownedItems)`

Validates that the user owns all paid items in their configuration:

```typescript
const ownershipValidation = validateItemOwnership('human', config, ownedItems)
// Returns: { valid: false, errors: ['You don\'t own the Human Knight Helmet'] }
```

These validations run before saving a configuration, preventing:
- Cross-race contamination (using goblin items on a human warrior)
- Saving configurations with unpurchased items

### 5. Race-Filtered Purchase History

When loading purchased items, the system filters them by race:

```typescript
const raceSpecificPurchases = purchasedProductIds.filter(id => {
  return id.startsWith(race === 'human' ? 'human-' : 'goblin-')
})
```

This ensures:
- Users only see items they've purchased for the current race
- Complete bundle ownership is checked per-race
- No cross-race item access

### 6. Database Schema

The database enforces race separation at the schema level:

```sql
CREATE TABLE warrior_configurations (
  user_id UUID REFERENCES auth.users(id),
  race TEXT CHECK (race IN ('human', 'goblin')),
  helmet TEXT NOT NULL,
  armor TEXT NOT NULL,
  weapon TEXT NOT NULL,
  facial_hair TEXT NOT NULL,
  UNIQUE(user_id, race)  -- One configuration per user per race
);
```

This constraint ensures:
- Users can save one configuration per race
- Configurations are stored separately
- No race mixing at the database level

## User Experience Flow

### Switching from Human to Goblin

1. User clicks "Goblin Warrior" tab
2. Confirmation dialog appears:
   - "Switching races will reset your current configuration..."
   - Shows warning if unsaved changes exist
3. User confirms
4. System:
   - Resets configuration to defaults
   - Loads saved goblin configuration (if exists)
   - Filters owned items to goblin-specific
   - Filters shop items to goblin-specific
   - Shows toast notification confirming switch

### Attempting to Save Invalid Configuration

1. User tries to save configuration
2. System validates:
   - All items belong to current race
   - User owns all paid items
3. If validation fails:
   - Shows error toast with specific issue
   - Configuration is not saved
4. If validation passes:
   - Saves to database
   - Updates saved configuration state
   - Shows success toast

## Benefits

1. **Data Integrity**: Impossible to save cross-race configurations
2. **Clear Separation**: Each race feels like a separate character
3. **User-Friendly**: Clear warnings and confirmations
4. **Secure**: Server-side validation prevents tampering
5. **Scalable**: Easy to add new races in the future

## Free Items Per Race

Each race has default free items:

**Human:**
- Helmet: Basic
- Armor: Leather
- Weapon: Sword
- Facial Hair: Full Beard

**Goblin:**
- Helmet: Crude
- Armor: Scrap
- Weapon: Dagger
- Facial Hair: Scraggly

Free items are automatically available and don't require purchase validation.

## Technical Implementation

### Frontend Components

- `RaceConfirmationDialog`: Handles race switching confirmation
- `CustomizationPanel`: Filters items by race using `getItemsBySlot()`
- `WarriorScene`: Renders race-specific 3D models

### Validation Layer

- `lib/validation.ts`: Contains all validation logic
- Validates both race matching and ownership
- Returns detailed error messages

### State Management

- Separate `savedConfigs` state tracks saved configurations per race
- `ownedItems` filtered by current race
- Race change triggers full configuration reload

## Future Enhancements

1. Add more races (e.g., Elf, Orc)
2. Implement race-specific abilities
3. Add race-locked story quests
4. Create race-specific environments
5. Add cross-race comparison view
