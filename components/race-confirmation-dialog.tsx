'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface RaceConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  newRace: 'human' | 'goblin'
  hasUnsavedChanges: boolean
}

export function RaceConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  newRace,
  hasUnsavedChanges,
}: RaceConfirmationDialogProps) {
  const raceName = newRace === 'human' ? 'Human Warrior' : 'Goblin Warrior'
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch to {raceName}?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Switching races will reset your current configuration to the default settings for {raceName}.
            </p>
            {hasUnsavedChanges && (
              <p className="text-amber-500 font-medium">
                Warning: You have unsaved changes that will be lost.
              </p>
            )}
            <p>
              Your purchased items and saved configurations for each race are preserved separately,
              so you can switch between races at any time without losing progress.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Switch to {raceName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
