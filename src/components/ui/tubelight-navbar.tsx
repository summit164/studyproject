"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  position?: "fixed" | "relative"
  onChange?: (activeName: string) => void
}

export function NavBar({ items, className, position = "fixed", onChange }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)

  const wrapperClasses = position === "fixed"
    ? "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6"
    : "z-50"

  return (
    <div className={cn(wrapperClasses, className)}>
      <div className="w-full mx-auto flex items-center gap-1.5 bg-white/50 dark:bg-white/15 border border-border backdrop-blur-md py-1 px-1 rounded-full shadow-xl">
        {items.map((item) => (
          (() => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => {
                  setActiveTab(item.name)
                  onChange?.(item.name)
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-2 sm:px-3 py-1.5 rounded-full transition-colors flex-1 text-center",
                  isActive ? "text-foreground" : "text-foreground/80 hover:text-primary",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={16} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full rounded-full -z-10 bg-gray-200 dark:bg-white/20 shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                )}
              </Link>
            )
          })()
        ))}
      </div>
    </div>
  )
}
