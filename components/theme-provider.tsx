"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import MUIRegistry from "./mui-registry"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <MUIRegistry>{children}</MUIRegistry>
    </NextThemesProvider>
  )
}
