"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Save, ArrowLeft, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const LANGUAGES = [
  { value: "text", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
]

interface Paste {
  id: string
  title: string
  content: string
  language: string
  is_public: boolean
}

interface EditPasteFormProps {
  paste: Paste
}

export function EditPasteForm({ paste }: EditPasteFormProps) {
  const [title, setTitle] = useState(paste.title)
  const [content, setContent] = useState(paste.content)
  const [language, setLanguage] = useState(paste.language)
  const [isPublic, setIsPublic] = useState(paste.is_public)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError("Content is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("pastes")
        .update({
          title: title.trim() || "Untitled",
          content: content.trim(),
          language,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", paste.id)

      if (updateError) throw updateError

      toast({
        title: "Paste updated",
        description: "Your paste has been successfully updated.",
      })

      // Redirect back to the paste view
      router.push(`/paste/${paste.id}`)
    } catch (error: any) {
      console.error("Error updating paste:", error)
      setError(error.message || "Failed to update paste")
      toast({
        title: "Update failed",
        description: error.message || "Failed to update paste",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges =
    title !== paste.title || content !== paste.content || language !== paste.language || isPublic !== paste.is_public

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/paste/${paste.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Paste
          </Link>
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Paste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your paste..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Paste your code or text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm bg-input resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public" className="text-sm">
                  Make this paste public
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/paste/${paste.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading || !content.trim() || !hasChanges}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Paste
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
