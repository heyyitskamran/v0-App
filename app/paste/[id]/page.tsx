import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PasteView } from "@/components/paste-view"
import { Header } from "@/components/header"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: paste, error } = await supabase.from("pastes").select("*").eq("id", id).single()

  if (error || !paste) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PasteView paste={paste} />
      </main>
    </div>
  )
}
