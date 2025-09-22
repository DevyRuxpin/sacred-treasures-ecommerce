"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type || "info"]

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, onClose])

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full",
        styles[toast.type || "info"]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-medium text-sm">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90 mt-1">{toast.description}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0 hover:bg-black/10"
        onClick={() => onClose(toast.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Toast Store
interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
}

import { create } from "zustand"

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
  success: (message, description) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, title: message, description, type: "success" }],
    }))
  },
  error: (message, description) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, title: message, description, type: "error" }],
    }))
  },
  warning: (message, description) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, title: message, description, type: "warning" }],
    }))
  },
  info: (message, description) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, title: message, description, type: "info" }],
    }))
  },
}))

// Toast Container
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}
