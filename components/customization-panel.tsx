"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import {
  getItemsBySlot,
  getThemedBundleByRace,
  getCompleteBundleByRace,
} from "@/lib/products";
import { useState } from "react";

interface CustomizationPanelProps {
  race: "human" | "goblin";
  config: {
    helmet: string;
    chestplate: string;
    pants: string;
    shoes: string;
    weapon: string;
    shield: string;
    facialHair: string;
    mount: string;
  };
  ownedItems: string[];
  onConfigChange: (slot: string, value: string) => void;
  onPurchase: (productId: string) => void;
  onPurchaseThemedBundle: () => void;
  onPurchaseCompleteBundle: () => void;
}

const FREE_ITEMS = {
  helmet: ["none", "archer_hood", "squire_helmet", "swiss_helmet"],
  chestplate: [
    "none",
    "archer_chestplate",
    "squire_chestplate",
    "swiss_chestplate",
  ],
  pants: ["none", "archer_pants", "squire_pants", "swiss_pants"],
  shoes: ["none", "archer_shoes", "squire_shoes", "swiss_shoes"],
  weapon: [
    "none",
    "bat",
    "dagger",
    "mace",
    "spiky_bat",
    "spear",
    "staff",
    "archer_bow",
    "squire_sword",
    "swiss_halberd",
  ],
  shield: ["none", "squire_shield", "tower_shield", "round_shield"],
  facial_hair: ["none"],
  mount: ["none"],
};

const SLOT_LABELS = {
  helmet: "Helmets",
  facial_hair: "Facial Hair",
  chestplate: "Chestplate",
  pants: "Pants",
  shoes: "Shoes",
  weapon: "Weapons",
  shield: "Shields",
  mount: "Mounts",
};

export function CustomizationPanel({
  race,
  config,
  ownedItems,
  onConfigChange,
  onPurchase,
  onPurchaseThemedBundle,
  onPurchaseCompleteBundle,
}: CustomizationPanelProps) {
  const [activeSlot, setActiveSlot] = useState<string>("helmet");

  const themedBundle = getThemedBundleByRace(race);
  const completeBundle = getCompleteBundleByRace(race);

  function renderSlotItems(slot: string) {
    const items = getItemsBySlot(race, slot);

    return (
      <div className="space-y-2">
        {/* None option - always free */}
        <Card
          className={`p-3 cursor-pointer transition-colors ${
            config[slot as keyof typeof config] === "none"
              ? "border-primary bg-primary/10"
              : "hover:bg-muted/50"
          }`}
          onClick={() => onConfigChange(slot, "none")}
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
          const isFree = FREE_ITEMS[slot as keyof typeof FREE_ITEMS]?.includes(
            item.itemId || "",
          );
          const isOwned = ownedItems.includes(item.id);
          const isSelected =
            config[slot as keyof typeof config] === item.itemId;

          return (
            <Card
              key={item.id}
              className={`p-3 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => onConfigChange(slot, item.itemId || "")}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {item.name.replace(
                        `${race === "human" ? "Human" : "Goblin"} `,
                        "",
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isFree ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : isOwned ? (
                    <Badge variant="default">Owned</Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPurchase(item.id);
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />$
                      {(item.priceInCents / 100).toFixed(2)}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Bundle Purchase Section */}
      {(themedBundle || completeBundle) && (
        <div className="p-4 border-b bg-muted/30 space-y-3">
          {/* Themed Bundle */}
          {themedBundle && (
            <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold">{themedBundle?.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {themedBundle?.description}
                  </p>
                </div>
                <Button onClick={onPurchaseThemedBundle} size="sm">
                  <ShoppingCart className="h-3 w-3 mr-1" />$
                  {themedBundle
                    ? (themedBundle.priceInCents / 100).toFixed(2)
                    : "4.99"}
                </Button>
              </div>
            </Card>
          )}

          {/* Complete Bundle */}
          {completeBundle && (
            <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{completeBundle?.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {completeBundle?.description}
                  </p>
                </div>
                <Button onClick={onPurchaseCompleteBundle} size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />$
                  {completeBundle
                    ? (completeBundle.priceInCents / 100).toFixed(2)
                    : "23.99"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Slot Tabs */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {Object.entries(SLOT_LABELS).map(([slot, label]) => (
          <button
            key={slot}
            onClick={() => setActiveSlot(slot)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeSlot === slot
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4">{renderSlotItems(activeSlot)}</div>
      </ScrollArea>
    </div>
  );
}
