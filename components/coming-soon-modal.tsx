"use client"

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Clock } from 'lucide-react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  featureName,
  description,
  icon: Icon
}: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-teal-500/30">
                {Icon ? (
                  <Icon className="w-8 h-8 text-teal-400" />
                ) : (
                  <Sparkles className="w-8 h-8 text-teal-400" />
                )}
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge 
                  variant="secondary" 
                  className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-2 py-1"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Soon
                </Badge>
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-center">
            {featureName} Coming Soon!
          </DialogTitle>
          
          <DialogDescription className="text-center leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-3 mt-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>We're working hard to bring you this feature</span>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}