"use client"

import { useToast } from "@/components/ui/use-toast"

export function addToast(message: string, type: "success" | "error" | "info" = "info") {
  const { toast } = useToast()
  toast({
    message,
    type,
  })
}
