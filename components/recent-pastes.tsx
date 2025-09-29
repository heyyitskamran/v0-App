"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Clock, Code2, Eye, Copy, Edit, Check, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { DeletePasteDialog } from "@/components/delete-paste-dialog"

interface Paste {
  id: string
  title: string
  language: string
  created_at: string
  content: string
}

export function RecentPastes() {
  const [pastes, setPastes] = useState<Paste[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedPastes, setCopiedPastes] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pasteToDelete, setPasteToDelete] = useState<Paste | null>(null)

  useEffect(() => {
    async function fetchRecentPastes() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("pastes")
          .select("id, title, language, created_at, content")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) throw error
        setPastes(data || [])
      } catch (error) {
        console.error("Error fetching recent pastes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentPastes()
  }, [])

  const handleCopy = async (paste: Paste, event: React.MouseEvent) => {
    event.preventDefault() // Prevent navigation when clicking copy button
    event.stopPropagation()

    try {
      await navigator.clipboard.writeText(paste.content)
      setCopiedPastes((prev) => new Set(prev).add(paste.id))
      toast({
        title: "Copied to clipboard",
        description: `"${paste.title}" has been copied to your clipboard.`,
      })

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedPastes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(paste.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (paste: Paste, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setPasteToDelete(paste)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (pasteToDelete) {
      setPastes((prev) => prev.filter((p) => p.id !== pasteToDelete.id))
      setPasteToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Recent Public Pastes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Recent Public Pastes
      </h2>

      {pastes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No public pastes yet. Be the first to create one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastes.map((paste) => (
            <Link key={paste.id} href={`/paste/${paste.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full relative group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-1">{paste.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {paste.language}
                    </Badge>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 font-mono">{paste.content}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      View paste
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => handleCopy(paste, e)}
                        title="Copy content"
                      >
                        {copiedPastes.has(paste.id) ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(`/paste/${paste.id}/edit`, "_blank")
                        }}
                        title="Edit paste"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(paste, e)}
                        title="Delete paste"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pasteToDelete && (
        <DeletePasteDialog
          pasteId={pasteToDelete.id}
          pasteTitle={pasteToDelete.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}
