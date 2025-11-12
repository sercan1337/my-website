"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface TagComboboxProps {
  tags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

export function TagCombobox({
  tags,
  selectedTags,
  onTagsChange,
  placeholder = "Select tags...",
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSelect = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    onTagsChange(newSelectedTags)
  }

  const filteredTags = React.useMemo(() => {
    if (!searchQuery.trim()) return tags
    const query = searchQuery.toLowerCase()
    return tags.filter((tag) => tag.toLowerCase().includes(query))
  }, [tags, searchQuery])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by tags:
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedTags.length > 0
                ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[calc(var(--radix-popover-trigger-width)-60px)] max-w-[280px] p-0 border-0 shadow-none bg-transparent !animate-none" 
          align="start"
          side="right"
          sideOffset={8}
        >
          <div 
            key={open ? 'open' : 'closed'}
            className={cn(
              "flex flex-col bg-white dark:bg-gray-900 rounded-md border border-border shadow-md",
              open && "popover-slide-in"
            )}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-border px-3 py-2">
              <svg
                className="mr-2 h-4 w-4 shrink-0 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>

            {/* Tag List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredTags.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {searchQuery.trim() ? "No tags found." : "No tags available."}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelect(tag)}
                        className={cn(
                          "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground",
                          isSelected && "bg-accent text-accent-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="flex-1 text-left font-medium">{tag}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="text-xs gap-1.5 pr-1.5 pl-2 py-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(tag)
                }}
                className="ml-0.5 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={() => onTagsChange([])}
            className="text-xs text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
