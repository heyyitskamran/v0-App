"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DeletePasteDialogProps {
  pasteId: string
  pasteTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteSuccess?: () => void
}

export function DeletePasteDialog({
  pasteId,
  pasteTitle,
  open,
  onOpenChange,
  onDeleteSuccess,
}: DeletePasteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("pastes").delete().eq("id", pasteId)

      if (error) throw error

      toast({
        title: "Paste deleted",
        description: "Your paste has been permanently deleted.",
      })

      onOpenChange(false)

      if (onDeleteSuccess) {
        onDeleteSuccess()
      } else {
        router.push("/pastes")
      }
    } catch (error: any) {
      console.error("Error deleting paste:", error)
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete paste",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Paste</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{pasteTitle}"? This action cannot be undone and the paste will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Paste"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
