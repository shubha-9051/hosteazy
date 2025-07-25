

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Moon, Sun } from "lucide-react"

interface Repo {
  name: string
  html_url: string
}

export default function Repo() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const getRepo = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("No access token found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      const extractedData = response.data.map((repo: any) => ({
        name: repo.name,
        html_url: repo.html_url,
      }))

      setRepos(extractedData)
    } catch (error) {
      console.error("Error fetching repositories:", error)
      setError("Failed to fetch repositories")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectRepo = (repoName: string) => {
    setSelectedRepos((prev) =>
      prev.includes(repoName) ? prev.filter((name) => name !== repoName) : [...prev, repoName],
    )
  }

  return (
    <div className={`space-y-4 p-4 ${isDarkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center">
        <Button onClick={getRepo} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            "Your Repos"
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full w-10 h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <Card className="w-full bg-card text-card-foreground shadow-sm border border-border">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl font-semibold">Repositories</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {repos.length === 0 && !loading && !error ? (
            <p className="text-muted-foreground">No repositories found. Click "Your Repos" to load.</p>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => (
                <div
                  key={repo.name}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent transition-colors"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {repo.name}
                  </a>
                  <Button
                    variant={selectedRepos.includes(repo.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSelectRepo(repo.name)}
                    className={
                      selectedRepos.includes(repo.name)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    {selectedRepos.includes(repo.name) ? "Selected" : "Select"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

