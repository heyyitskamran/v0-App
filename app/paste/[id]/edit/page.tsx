import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditPasteForm } from "@/components/edit-paste-form"
import { Header } from "@/components/header"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPastePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get the paste
  const { data: paste, error } = await supabase.from("pastes").select("*").eq("id", id).single()

  if (error || !paste) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <EditPasteForm paste={paste} />
        </div>
      </main>
    </div>
  )
}
