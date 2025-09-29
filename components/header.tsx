import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, Plus, List } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Code2 className="h-6 w-6" />
            PasteApp
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Create
            </Link>
            <Link href="/pastes" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="md:hidden">
              <Link href="/pastes">
                <List className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                New Paste
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
