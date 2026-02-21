# Warrior Configuration System

## Overview

This document explains how the warrior configuration save/update system works, including the race locking mechanism and data integrity enforcement.

## Architecture

### Database Schema

The `warrior_configurations` table has the following key constraints:

- **Unique constraint on `user_id`**: Each user can only have ONE configuration
- **Race locking trigger**: Prevents race changes after initial save
- **RLS policies**: Ensures users can only access/modify their own data

### Server Actions

Located in `/app/actions/configuration.ts`, these server-side functions handle all configuration operations:

#### `checkExistingConfiguration(userId: string)`

Checks if a user already has a saved configuration.

**Returns:**
```typescript
{
  exists: boolean,
  configuration: ConfigData | null,
  error: string | null
}
```

**Usage:**
```typescript
const result = await checkExistingConfiguration(user.id)
if (result.exists) {
  console.log('User has existing config:', result.configuration)
}
```

#### `saveConfiguration(userId: string, configData: ConfigurationData)`

Saves or updates a user's configuration. Automatically determines whether to INSERT or UPDATE.

**Parameters:**
```typescript
interface ConfigurationData {
  race: 'human' | 'goblin'
  helmet: string
  armor: string
  weapon: string
  facial_hair: string
}
```

**Returns:**
```typescript
{
  success: boolean,
  error: string | null,
  operation: 'insert' | 'update' | null,
  data: ConfigData | null
}
```

**Usage:**
```typescript
const result = await saveConfiguration(user.id, {
  race: 'human',
  helmet: 'knight',
  armor: 'plate',
  weapon: 'sword',
  facial_hair: 'beard'
})

if (result.success) {
  console.log('Operation:', result.operation) // 'insert' or 'update'
}
```

#### `loadConfiguration(userId: string)`

Loads a user's saved configuration.

**Returns:**
```typescript
{
  data: ConfigData | null,
  error: string | null
}
```

## How It Works

### First Save (INSERT)

1. User customizes their warrior
2. User clicks "Save Configuration"
3. System validates race-specific items and ownership
4. `checkExistingConfiguration()` returns `exists: false`
5. `saveConfiguration()` performs **INSERT**
6. Database trigger locks user to selected race
7. UI disables race switching tabs
8. User sees: "Configuration Created! You are now permanently locked to [race] warrior."

### Subsequent Saves (UPDATE)

1. User modifies their existing warrior
2. User clicks "Save Configuration"
3. System validates race-specific items and ownership
4. `checkExistingConfiguration()` returns `exists: true`
5. `saveConfiguration()` performs **UPDATE** on same record
6. Race cannot be changed (enforced by database trigger)
7. User sees: "Configuration Updated! Your [race] warrior configuration has been updated successfully."

## Data Integrity

### Race Locking

Once a user saves their first configuration, they are **permanently locked** to that race.

**Database Trigger:**
```sql
CREATE TRIGGER enforce_race_lock
  BEFORE INSERT OR UPDATE ON warrior_configurations
  FOR EACH ROW
  EXECUTE FUNCTION check_race_locked();
```

The trigger:
- Checks if user already has a configuration
- If race differs from saved race, raises an exception
- Prevents race changes at the database level

**UI Enforcement:**
- Race tabs become disabled after first save
- Visual indicator shows locked race
- Attempt to change race shows error toast

### RLS Policies

**Insert Policy:**
```sql
CREATE POLICY "warrior_configurations_insert_own" 
  ON warrior_configurations 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM warrior_configurations 
      WHERE user_id = auth.uid()
    )
  );
```

Prevents:
- Creating multiple configurations per user
- Creating configurations for other users

**Update Policy:**
```sql
CREATE POLICY "warrior_configurations_update_own" 
  ON warrior_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

Allows:
- Users to update their own configuration
- Legitimate updates while maintaining race lock (handled by trigger)

### Validation Layers

1. **Client-side validation** (instant feedback):
   - Race-specific item validation
   - Item ownership validation
   - UI state management

2. **Server-side validation** (security):
   - User authentication
   - Configuration existence check
   - Race consistency validation

3. **Database-level validation** (integrity):
   - Unique constraint on user_id
   - Race locking trigger
   - RLS policies

## Client Usage

### In React Components

```typescript
import { saveConfiguration, checkExistingConfiguration } from '@/app/actions/configuration'

async function handleSaveConfiguration() {
  // Check if user has existing config
  const existingCheck = await checkExistingConfiguration(user.id)
  const isUpdate = existingCheck.exists
  
  console.log('Will perform:', isUpdate ? 'UPDATE' : 'INSERT')
  
  // Save configuration
  const result = await saveConfiguration(user.id, {
    race,
    helmet: config.helmet,
    armor: config.armor,
    weapon: config.weapon,
    facial_hair: config.facialHair
  })
  
  if (result.success) {
    // Handle success based on operation type
    const operationText = result.operation === 'insert' ? 'created' : 'updated'
    console.log(`Configuration ${operationText}`)
  } else {
    // Handle error
    console.error('Error:', result.error)
  }
}
```

## Error Handling

### Common Errors

**Race Change Attempt:**
```
Error: Cannot change race after initial configuration is saved. 
You are locked to human warrior.
```

**Solution:** Database trigger prevents this. User must use their locked race.

**Multiple Configurations:**
```
Error: duplicate key value violates unique constraint 
"idx_warrior_configurations_user_id_unique"
```

**Solution:** Use UPDATE instead of INSERT. The `saveConfiguration()` function handles this automatically.

**RLS Policy Violation:**
```
Error: new row violates row-level security policy for table "warrior_configurations"
```

**Solution:** Ensure user is authenticated and using correct user_id.

## Testing

### Test First Save
1. Sign in as new user
2. Select race (human or goblin)
3. Customize warrior
4. Click "Save Configuration"
5. Verify: "Configuration Created!" message
6. Verify: Race tabs are now disabled

### Test Update
1. With existing configuration loaded
2. Change armor/weapon/helmet
3. Click "Save Configuration"
4. Verify: "Configuration Updated!" message
5. Verify: Changes are persisted on page reload

### Test Race Lock
1. With existing configuration
2. Try to click disabled race tab
3. Verify: Error toast appears
4. Verify: Race remains locked

## Summary

The system ensures:
- ✅ Each user has exactly ONE configuration
- ✅ Users are locked to their initially selected race
- ✅ Updates overwrite existing configuration
- ✅ Race-specific items are validated
- ✅ Data integrity is maintained at all layers
- ✅ Clear user feedback for all operations
