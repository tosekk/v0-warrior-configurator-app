'use client'

import { useState, useEffect } from 'react'
import { WarriorScene } from '@/components/warrior-scene'
import { CustomizationPanel } from '@/components/customization-panel'
import { AuthDialog } from '@/components/auth-dialog'
import { CheckoutDialog } from '@/components/checkout-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, LogOut, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { validateRaceConfiguration, validateItemOwnership } from '@/lib/validation'

export default function Home() {
  const [race, setRace] = useState<'human' | 'goblin'>('human')
  const [config, setConfig] = useState({
    helmet: 'none',
    armor: 'none',
    weapon: 'none',
    facialHair: 'none'
  })
  const [user, setUser] = useState<any>(null)
  const [ownedItems, setOwnedItems] = useState<string[]>([])
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [raceDialogOpen, setRaceDialogOpen] = useState(false)
  const [pendingRace, setPendingRace] = useState<'human' | 'goblin' | null>(null)
  const [savedConfigs, setSavedConfigs] = useState<{ [key: string]: any }>({})
  const [lockedRace, setLockedRace] = useState<'human' | 'goblin' | null>(null)
  const [isRaceLocked, setIsRaceLocked] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
    
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      await loadUserData(user.id)
    }
  }

  async function loadUserData(userId: string) {
    const supabase = createClient()
    
    console.log('[v0] Loading user data')
    
    // Load warrior configuration (now only one per user)
    const { data: configData } = await supabase
      .from('warrior_configurations')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (configData) {
      // User has a saved configuration - lock to that race
      const savedRace = configData.race as 'human' | 'goblin'
      const loadedConfig = {
        helmet: configData.helmet || 'none',
        armor: configData.armor || 'none',
        weapon: configData.weapon || 'none',
        facialHair: configData.facial_hair || 'none'
      }
      
      console.log('[v0] Loaded saved configuration. Race locked to:', savedRace)
      
      setLockedRace(savedRace)
      setIsRaceLocked(true)
      setRace(savedRace)
      setConfig(loadedConfig)
      setSavedConfigs({ [savedRace]: loadedConfig })
      
      toast({
        title: `Welcome Back, ${savedRace === 'human' ? 'Human' : 'Goblin'} Warrior!`,
        description: `Your race is locked to ${savedRace}. Your configuration has been loaded.`,
      })
    } else {
      console.log('[v0] No saved configuration found - race selection is available')
      setIsRaceLocked(false)
      setLockedRace(null)
    }
    
    // Load purchased items (filter by locked/current race)
    const { data: purchasesData } = await supabase
      .from('user_purchases')
      .select('product_id')
      .eq('user_id', userId)
    
    if (purchasesData) {
      const purchasedProductIds = purchasesData.map(p => p.product_id)
      const currentRace = configData?.race || race
      
      // Check if user owns complete bundle for current race
      const completeBundleId = currentRace === 'human' ? 'human-complete-bundle' : 'goblin-complete-bundle'
      const ownsCompleteBundle = purchasedProductIds.includes(completeBundleId)
      
      console.log('[v0] User owns complete bundle for', currentRace, ':', ownsCompleteBundle)
      
      if (ownsCompleteBundle) {
        // If they own complete bundle, mark all items as owned for this race
        import('@/lib/products').then(({ getProductsByRace }) => {
          const allRaceItems = getProductsByRace(currentRace)
            .filter(p => p.type === 'item')
            .map(p => p.id)
          
          // Only include purchased items that belong to the current race
          const raceSpecificPurchases = purchasedProductIds.filter(id => {
            return id.startsWith(currentRace === 'human' ? 'human-' : 'goblin-')
          })
          
          setOwnedItems([...raceSpecificPurchases, ...allRaceItems])
          console.log('[v0] Owned items for', currentRace, ':', [...raceSpecificPurchases, ...allRaceItems].length, 'items')
        })
      } else {
        // Only show purchased items for the current race
        const raceSpecificPurchases = purchasedProductIds.filter(id => {
          return id.startsWith(currentRace === 'human' ? 'human-' : 'goblin-')
        })
        setOwnedItems(raceSpecificPurchases)
        console.log('[v0] Owned items for', currentRace, ':', raceSpecificPurchases.length, 'items')
      }
    }
  }

  async function handleSaveConfiguration() {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }

    console.log('[v0] Saving configuration for race:', race, config)
    
    // Validate that all items belong to the current race
    const raceValidation = validateRaceConfiguration(race, config)
    if (!raceValidation.valid) {
      console.error('[v0] Race validation failed:', raceValidation.errors)
      toast({
        title: 'Invalid Configuration',
        description: raceValidation.errors.join(', '),
        variant: 'destructive'
      })
      return
    }
    
    // Validate item ownership
    const ownershipValidation = validateItemOwnership(race, config, ownedItems)
    if (!ownershipValidation.valid) {
      console.error('[v0] Ownership validation failed:', ownershipValidation.errors)
      toast({
        title: 'Items Not Owned',
        description: ownershipValidation.errors[0] || 'You must purchase these items first.',
        variant: 'destructive'
      })
      return
    }

    const supabase = createClient()
    
    // Use upsert with user_id as the conflict key (now only one config per user)
    const { error } = await supabase
      .from('warrior_configurations')
      .upsert({
        user_id: user.id,
        race,
        helmet: config.helmet,
        armor: config.armor,
        weapon: config.weapon,
        facial_hair: config.facialHair,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (error) {
      console.error('[v0] Error saving configuration:', error)
      toast({
        title: 'Error Saving Configuration',
        description: error.message || 'Failed to save your warrior configuration. Please try again.',
        variant: 'destructive'
      })
    } else {
      // Lock the race after first save
      if (!isRaceLocked) {
        setIsRaceLocked(true)
        setLockedRace(race)
        console.log('[v0] Race locked to:', race)
      }
      
      // Update saved configs state
      setSavedConfigs({ [race]: config })
      console.log('[v0] Configuration saved successfully')
      
      const lockMessage = isRaceLocked 
        ? ''
        : ` You are now permanently locked to ${race} warrior.`
      
      toast({
        title: 'Configuration Saved!',
        description: `Your ${race} warrior configuration has been saved successfully.${lockMessage}`,
      })
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOwnedItems([])
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
    })
    router.refresh()
  }

  function handleConfigChange(slot: string, value: string) {
    setConfig(prev => ({ ...prev, [slot]: value }))
  }

  function handlePurchase(productId: string) {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }
    
    setSelectedProductId(productId)
    setCheckoutDialogOpen(true)
  }

  function handlePurchaseThemedBundle() {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }
    
    const bundleId = race === 'human' ? 'human-knight-set' : 'goblin-raider-set'
    setSelectedProductId(bundleId)
    setCheckoutDialogOpen(true)
  }

  function handlePurchaseCompleteBundle() {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }
    
    const bundleId = race === 'human' ? 'human-complete-bundle' : 'goblin-complete-bundle'
    setSelectedProductId(bundleId)
    setCheckoutDialogOpen(true)
  }

  function handleRaceChange(newRace: 'human' | 'goblin') {
    if (newRace === race) return
    
    // Prevent race change if locked
    if (isRaceLocked) {
      toast({
        title: 'Race Locked',
        description: `You are permanently locked to ${lockedRace} warrior after saving your first configuration.`,
        variant: 'destructive'
      })
      return
    }
    
    console.log('[v0] Switching to', newRace, 'race (not locked yet)')
    
    setRace(newRace)
    
    // Reset config to default when changing race
    const defaultConfig = {
      helmet: 'none',
      armor: 'none',
      weapon: 'none',
      facialHair: 'none'
    }
    setConfig(defaultConfig)
    
    toast({
      title: `Switched to ${newRace === 'human' ? 'Human' : 'Goblin'} Warrior`,
      description: `You can switch races until you save your first configuration.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Warrior Configurator
            </h1>
            <p className="text-sm text-slate-400">Create your ultimate warrior</p>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={handleSaveConfiguration}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => setAuthDialogOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Race Selector */}
        <div className="mb-6 flex justify-center">
          <Card className="p-2 bg-slate-900/50 border-slate-800">
            <Tabs value={race} onValueChange={(v) => handleRaceChange(v as 'human' | 'goblin')}>
              <TabsList className="bg-slate-950">
                <TabsTrigger 
                  value="human" 
                  className="data-[state=active]:bg-amber-500"
                  disabled={isRaceLocked && lockedRace !== 'human'}
                >
                  Human Warrior
                </TabsTrigger>
                <TabsTrigger 
                  value="goblin" 
                  className="data-[state=active]:bg-green-600"
                  disabled={isRaceLocked && lockedRace !== 'goblin'}
                >
                  Goblin Warrior
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {isRaceLocked && (
              <div className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                Race locked to {lockedRace}
              </div>
            )}
          </Card>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6 h-[calc(100vh-220px)]">
          {/* 3D Viewport */}
          <Card className="overflow-hidden bg-slate-900/50 border-slate-800">
            <WarriorScene config={{ race, ...config }} />
          </Card>

          {/* Customization Panel */}
          <Card className="overflow-hidden bg-slate-900/50 border-slate-800">
            <CustomizationPanel
              race={race}
              config={config}
              ownedItems={ownedItems}
              onConfigChange={handleConfigChange}
              onPurchase={handlePurchase}
              onPurchaseThemedBundle={handlePurchaseThemedBundle}
              onPurchaseCompleteBundle={handlePurchaseCompleteBundle}
            />
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <CheckoutDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        productId={selectedProductId}
      />
    </div>
  )
}
