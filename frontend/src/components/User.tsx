import * as React from "react"
import axios from "axios"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function User() {


    const [reposs, setReposs] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        getRepo(token);
      }
    }, []);
  
    const getRepo = async (token) => {
      try {
        const response = await axios.get('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
  
        const extractedData = response.data.map(repo => ({
          name: repo.name,
          html_url: repo.html_url
        }));
  
        setReposs(extractedData);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
            
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="react">React.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
        <Label htmlFor="framework">Framework</Label>
        <Select onValueChange={(value) => setSelectedRepo(value)}>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            {reposs.map((repo, index) => (
              <SelectItem key={index} value={repo.html_url}>
                {repo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRepo && (
        <div>
          <h1>Selected Repository</h1>
          <a href={selectedRepo} target="_blank" rel="noopener noreferrer">
            {selectedRepo}
          </a>
        </div>
      )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
