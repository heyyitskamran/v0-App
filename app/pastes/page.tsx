import { PasteList } from "@/components/paste-list"
import { Header } from "@/components/header"

export default function PastesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Pastes</h1>
            <p className="text-muted-foreground">
              Discover and explore public code snippets and text pastes from the community.
            </p>
          </div>
          <PasteList />
        </div>
      </main>
    </div>
  )
}
