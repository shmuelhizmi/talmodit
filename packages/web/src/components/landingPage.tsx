'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Upload, Link as LinkIcon } from "lucide-react"

export function LandingPage() {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('URL submitted:', url)
    // Add your URL processing logic here
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      console.log('File uploaded:', uploadedFile.name)
      // Add your file processing logic here
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="py-6 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-10 w-10 text-primary" />
            <span className="text-3xl font-extrabold tracking-tight">ReaderApp</span>
          </motion.div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl font-extrabold text-center mb-6 tracking-tight">Welcome to ReaderApp</h1>
          <p className="text-xl text-center mb-12 text-muted-foreground font-medium">Enter a URL or upload a document to start reading</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-12">
          <motion.form 
            onSubmit={handleUrlSubmit} 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Label htmlFor="url" className="text-lg font-semibold">Enter URL</Label>
            <div className="flex space-x-2">
              <Input
                type="url"
                id="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow text-lg"
              />
              <Button type="submit" size="lg" className="font-semibold">
                <LinkIcon className="mr-2 h-5 w-5" />
                Read
              </Button>
            </div>
          </motion.form>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Label htmlFor="file" className="text-lg font-semibold">Or upload a document</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-lg font-semibold text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">PDF, DOCX, TXT (MAX. 10MB)</p>
                </div>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                />
              </label>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground font-medium">
                File selected: {file.name}
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground font-medium">
          <p>&copy; 2024 ReaderApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}