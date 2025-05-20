"use client"

import type React from "react"

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

export default function MUIRegistry({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
