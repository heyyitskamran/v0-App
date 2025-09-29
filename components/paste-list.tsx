"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import {
  Search,
  Filter,
  Code2,
  Calendar,
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Check,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { DeletePasteDialog } from "@/components/delete-paste-dialog"

interface Paste {
  id: string
  title: string
  content: string
  language: string
  created_at: string
  is_public: boolean
  user_id: string | null
}

const LANGUAGES = [
  { value: "all", label: "All Languages" },
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

const ITEMS_PER_PAGE = 12

export function PasteList() {
  const [pastes, setPastes] = useState<Paste[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [copiedPastes, setCopiedPastes] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pasteToDelete, setPasteToDelete] = useState<Paste | null>(null)

  useEffect(() => {
    fetchPastes()
  }, [searchQuery, selectedLanguage, currentPage])

  const fetchPastes = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      let query = supabase
        .from("pastes")
        .select("*", { count: "exact" })
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (selectedLanguage !== "all") {
        query = query.eq("language", selectedLanguage)
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setPastes(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error fetching pastes:", error)
      setPastes([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    setCurrentPage(1)
  }

  const handleCopy = async (paste: Paste, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      await navigator.clipboard.writeText(paste.content)
      setCopiedPastes((prev) => new Set(prev).add(paste.id))
      toast({
        title: "Copied to clipboard",
        description: `"${paste.title}" has been copied to your clipboard.`,
      })

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
      setTotalCount((prev) => prev - 1)
      setPasteToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pastes by title or content..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-48 bg-input">
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              Showing {pastes.length} of {totalCount} paste{totalCount !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedLanguage !== "all" && ` in ${LANGUAGES.find((l) => l.value === selectedLanguage)?.label}`}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                  <div className="h-3 bg-muted rounded w-3/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pastes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Code2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pastes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedLanguage !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No public pastes have been created yet."}
            </p>
            <Button asChild>
              <Link href="/">Create the first paste</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastes.map((paste) => (
            <Link key={paste.id} href={`/paste/${paste.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full relative group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">{paste.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {paste.language}
                    </Badge>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4 font-mono mb-4">
                    {truncateContent(paste.content)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{paste.user_id ? "User" : "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
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
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
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
