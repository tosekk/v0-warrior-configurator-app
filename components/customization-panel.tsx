'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lock, ShoppingCart } from 'lucide-react'
import { getItemsBySlot, getBundleByRace } from '@/lib/products'
import { useState } from 'react'

interface CustomizationPanelProps {
  race: 'human' | 'goblin'
  config: {
    helmet: string
    armor: string
    weapon: string
    facialHair: string
  }
  ownedItems: string[]
  onConfigChange: (slot: string, value: string) => void
  onPurchase: (productId: string) => void
  onPurchaseBundle: () => void
}

const FREE_ITEMS = {
  helmet: ['none', 'basic'],
  armor: ['none', 'leather'],
  weapon: ['none', 'sword'],
  facial_hair: ['none', 'full']
}

const SLOT_LABELS = {
  helmet: 'Helmets',
  armor: 'Armor',
  weapon: 'Weapons',
  facial_hair: 'Facial Hair'
}

export function CustomizationPanel({
  race,
  config,
  ownedItems,
  onConfigChange,
  onPurchase,
  onPurchaseBundle
}: CustomizationPanelProps) {
  const [activeSlot, setActiveSlot] = useState<string>('helmet')
  
  const bundle = getBundleByRace(race)
  
  function renderSlotItems(slot: string) {
    const items = getItemsBySlot(race, slot)
    
    return (
      <div className="space-y-2">
        {/* None option - always free */}
        <Card
          className={`p-3 cursor-pointer transition-colors ${
            config[slot as keyof typeof config] === 'none'
              ? 'border-primary bg-primary/10'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onConfigChange(slot, 'none')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">None</p>
              <p className="text-xs text-muted-foreground">No {slot}</p>
            </div>
            <Badge variant="secondary">Free</Badge>
          </div>
        </Card>
        
        {/* Paid items */}
        {items.map((item) => {
          const isFree = FREE_ITEMS[slot as keyof typeof FREE_ITEMS]?.includes(item.itemId || '')
          const isOwned = ownedItems.includes(item.id)
          const isLocked = !isFree && !isOwned
          const isSelected = config[slot as keyof typeof config] === item.itemId
          
          return (
            <Card
              key={item.id}
              className={`p-3 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : isLocked
                  ? 'opacity-60'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                if (!isLocked) {
                  onConfigChange(slot, item.itemId || '')
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name.replace(`${race === 'human' ? 'Human' : 'Goblin'} `, '')}</p>
                    {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {isFree ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : isOwned ? (
                    <Badge variant="default">Owned</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPurchase(item.id)
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      ${(item.priceInCents / 100).toFixed(2)}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Bundle Purchase Section */}
      <div className="p-4 border-b bg-muted/30">
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">Complete Bundle</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unlock all {race} warrior customization options
              </p>
            </div>
            <Button onClick={onPurchaseBundle} size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              ${bundle ? (bundle.priceInCents / 100).toFixed(2) : '4.99'}
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Slot Tabs */}
      <div className="flex border-b overflow-x-auto">
        {Object.entries(SLOT_LABELS).map(([slot, label]) => (
          <button
            key={slot}
            onClick={() => setActiveSlot(slot)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeSlot === slot
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderSlotItems(activeSlot)}
        </div>
      </ScrollArea>
    </div>
  )
}
