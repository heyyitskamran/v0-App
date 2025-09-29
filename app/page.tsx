import { CreatePasteForm } from "@/components/create-paste-form"
import { Header } from "@/components/header"
import { RecentPastes } from "@/components/recent-pastes"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Share code and text
              <br />
              <span className="text-muted-foreground">instantly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Create, share, and collaborate on code snippets and text pastes with syntax highlighting and privacy
              controls.
            </p>
          </div>

          {/* Create Paste Form */}
          <div className="mb-12">
            <CreatePasteForm />
          </div>

          {/* Recent Pastes */}
          <div>
            <RecentPastes />
          </div>
        </div>
      </main>
    </div>
  )
}
