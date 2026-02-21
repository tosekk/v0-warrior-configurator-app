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
  const router = useRouter()

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
    
    // Load warrior configuration
    const { data: configData } = await supabase
      .from('warrior_configurations')
      .select('*')
      .eq('user_id', userId)
      .eq('race', race)
      .single()
    
    if (configData) {
      setConfig({
        helmet: configData.helmet || 'none',
        armor: configData.armor || 'none',
        weapon: configData.weapon || 'none',
        facialHair: configData.facial_hair || 'none'
      })
    }
    
    // Load purchased items
    const { data: purchasesData } = await supabase
      .from('user_purchases')
      .select('product_id')
      .eq('user_id', userId)
    
    if (purchasesData) {
      const purchasedProductIds = purchasesData.map(p => p.product_id)
      
      // Check if user owns complete bundle for current race
      const completeBundleId = race === 'human' ? 'human-complete-bundle' : 'goblin-complete-bundle'
      const ownsCompleteBundle = purchasedProductIds.includes(completeBundleId)
      
      if (ownsCompleteBundle) {
        // If they own complete bundle, mark all items as owned
        import('@/lib/products').then(({ getProductsByRace }) => {
          const allRaceItems = getProductsByRace(race)
            .filter(p => p.type === 'item')
            .map(p => p.id)
          setOwnedItems([...purchasedProductIds, ...allRaceItems])
        })
      } else {
        setOwnedItems(purchasedProductIds)
      }
    }
  }

  async function handleSaveConfiguration() {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }

    const supabase = createClient()
    
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
        onConflict: 'user_id,race'
      })
    
    if (error) {
      console.error('[v0] Error saving configuration:', error)
      alert('Error saving configuration')
    } else {
      alert('Configuration saved!')
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOwnedItems([])
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
    setRace(newRace)
    // Reset config when changing race
    setConfig({
      helmet: 'none',
      armor: 'none',
      weapon: 'none',
      facialHair: 'none'
    })
    
    // Load config for new race if user is logged in
    if (user) {
      loadUserData(user.id)
    }
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
                <TabsTrigger value="human" className="data-[state=active]:bg-amber-500">
                  Human Warrior
                </TabsTrigger>
                <TabsTrigger value="goblin" className="data-[state=active]:bg-green-600">
                  Goblin Warrior
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
