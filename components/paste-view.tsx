"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DeletePasteDialog } from "@/components/delete-paste-dialog"
import { Copy, Download, Share2, Calendar, UserIcon, Edit, Trash2, Check, ExternalLink, ArrowLeft } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface Paste {
  id: string
  title: string
  content: string
  language: string
  created_at: string
  updated_at: string
  is_public: boolean
  user_id: string | null
}

interface PasteViewProps {
  paste: Paste
}

export function PasteView({ paste }: PasteViewProps) {
  const [copied, setCopied] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The paste content has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([paste.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${paste.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${getFileExtension(paste.language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "The paste has been downloaded to your device.",
    })
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: paste.title,
          text: `Check out this paste: ${paste.title}`,
          url: url,
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "The paste link has been copied to your clipboard.",
        })
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied",
        description: "The paste link has been copied to your clipboard.",
      })
    }
  }

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      sql: "sql",
      bash: "sh",
      text: "txt",
    }
    return extensions[language] || "txt"
  }

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      typescript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      python: "bg-green-500/20 text-green-300 border-green-500/30",
      java: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      cpp: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      html: "bg-red-500/20 text-red-300 border-red-500/30",
      css: "bg-blue-400/20 text-blue-300 border-blue-400/30",
      json: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      xml: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      sql: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      bash: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    }
    return colors[language] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pastes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pastes
          </Link>
        </Button>
      </div>

      {/* Paste Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-balance">{paste.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge className={getLanguageColor(paste.language)}>{paste.language}</Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}</span>
                </div>
                {paste.updated_at !== paste.created_at && (
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>Updated {formatDistanceToNow(new Date(paste.updated_at), { addSuffix: true })}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  <span>{paste.user_id ? "User" : "Anonymous"}</span>
                </div>
                {!paste.is_public && <Badge variant="secondary">Private</Badge>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/paste/${paste.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive bg-transparent"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Paste Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Content</h2>
            <div className="text-sm text-muted-foreground">
              {paste.content.split("\n").length} lines • {paste.content.length} characters
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="relative">
            <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed bg-muted/30">
              <code className="text-foreground">{paste.content}</code>
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-70 hover:opacity-100"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paste Metadata */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Details</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-mono">{format(new Date(paste.created_at), "PPpp")}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <div className="font-mono">{format(new Date(paste.updated_at), "PPpp")}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>
              <div className="capitalize">{paste.language}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Visibility:</span>
              <div>{paste.is_public ? "Public" : "Private"}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Paste ID:</span>
              <div className="font-mono text-xs">{paste.id}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Direct Link:</span>
              <Button variant="link" className="h-auto p-0 text-xs" onClick={handleShare}>
                <ExternalLink className="h-3 w-3 mr-1" />
                Share this paste
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeletePasteDialog
        pasteId={paste.id}
        pasteTitle={paste.title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}
