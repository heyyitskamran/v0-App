import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <FileX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">Paste Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">The paste you're looking for doesn't exist or has been made private.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/pastes">
                <Search className="h-4 w-4 mr-2" />
                Browse Pastes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
