"use client"

import { useState, useCallback } from "react"
import { Container, Box, Typography, Alert, Snackbar } from "@mui/material"
import ControlPanel from "@/components/control-panel"
import Viewer3D from "@/components/viewer-3d"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [clothingUrl, setClothingUrl] = useState<string | null>(null)
  const [showClothing, setShowClothing] = useState(true)
  const [clothingPosition, setClothingPosition] = useState<[number, number, number]>([0, 0, 0])
  const [clothingScale, setClothingScale] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarUpload = useCallback(
    (file: File) => {
      try {
        if (avatarUrl) URL.revokeObjectURL(avatarUrl)

        const url = URL.createObjectURL(file)
        setAvatarUrl(url)
        setError(null)
      } catch (err) {
        console.error("Error uploading avatar:", err)
        setError("Failed to upload avatar. Please try a different file.")
      }
    },
    [avatarUrl],
  )

  const handleClothingUpload = useCallback(
    (file: File) => {
      try {
        if (clothingUrl) URL.revokeObjectURL(clothingUrl)

        const url = URL.createObjectURL(file)
        setClothingUrl(url)
        setError(null)
      } catch (err) {
        console.error("Error uploading clothing:", err)
        setError("Failed to upload clothing. Please try a different file.")
      }
    },
    [clothingUrl],
  )

  const handleToggleClothing = useCallback(() => {
    setShowClothing(!showClothing)
  }, [showClothing])

  const handleResetScene = useCallback(() => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    if (clothingUrl) URL.revokeObjectURL(clothingUrl)

    setAvatarUrl(null)
    setClothingUrl(null)
    setShowClothing(true)
    setError(null)
  }, [avatarUrl, clothingUrl])

  const handleCloseError = () => {
    setError(null)
  }

  return (
    <ThemeProvider>
      <Container maxWidth="lg" sx={{ height: "100vh", py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          3D Avatar Fitting App
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "calc(100% - 80px)" }}>
          <Box sx={{ flex: 1, height: { xs: "50%", md: "100%" }, mb: { xs: 2, md: 0 } }}>
            <Viewer3D
              avatarUrl={avatarUrl}
              clothingUrl={clothingUrl}
              showClothing={showClothing}
              clothingPosition={clothingPosition}
              clothingScale={clothingScale}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "300px" }, ml: { md: 2 } }}>
            <ControlPanel
              onAvatarUpload={handleAvatarUpload}
              onClothingUpload={handleClothingUpload}
              onToggleClothing={handleToggleClothing}
              onResetScene={handleResetScene}
              showClothing={showClothing}
              hasAvatar={!!avatarUrl}
              hasClothing={!!clothingUrl}
            />
          </Box>
        </Box>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}
