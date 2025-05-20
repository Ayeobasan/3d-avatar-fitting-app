"use client"

import type React from "react"
import { useState } from "react"
import { Paper, Typography, Button, Switch, FormControlLabel, Box, Alert } from "@mui/material"
import { Upload, RefreshCwIcon as Refresh, ViewIcon as Visibility, ImageOffIcon as ViewIconOff } from "lucide-react"

interface ControlPanelProps {
  onAvatarUpload: (file: File) => void
  onClothingUpload: (file: File) => void
  onToggleClothing: () => void
  onResetScene: () => void
  showClothing: boolean
  hasAvatar: boolean
  hasClothing: boolean
}

export default function ControlPanel({
  onAvatarUpload,
  onClothingUpload,
  onToggleClothing,
  onResetScene,
  showClothing,
  hasAvatar,
  hasClothing,
}: ControlPanelProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
      setFileError("Please upload a GLB or GLTF file")
      return false
    }

    if (file.size > 50 * 1024 * 1024) {
      setFileError("File size exceeds 50MB limit")
      return false
    }

    setFileError(null)
    return true
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "clothing") => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        if (type === "avatar") {
          onAvatarUpload(file)
        } else {
          onClothingUpload(file)
        }
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        if (!hasAvatar) {
          onAvatarUpload(file)
        } else if (!hasClothing) {
          onClothingUpload(file)
        } else {
          onAvatarUpload(file)
        }
      }
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        border: dragActive ? "2px dashed #1976d2" : "none",
        backgroundColor: dragActive ? "rgba(25, 118, 210, 0.04)" : "white",
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Typography variant="h6" gutterBottom>
        Controls
      </Typography>

      {dragActive && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Drop your 3D model here
        </Alert>
      )}

      {fileError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFileError(null)}>
          {fileError}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Upload Models
        </Typography>

        <Box sx={{ mb: 2 }}>
          <input
            accept=".glb,.gltf"
            style={{ display: "none" }}
            id="avatar-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "avatar")}
          />
          <label htmlFor="avatar-upload">
            <Button variant="contained" component="span" fullWidth startIcon={<Upload size={16} />} sx={{ mb: 1 }}>
              {hasAvatar ? "Replace Avatar" : "Upload Avatar"}
            </Button>
          </label>
        </Box>

        <Box sx={{ mb: 2 }}>
          <input
            accept=".glb,.gltf"
            style={{ display: "none" }}
            id="clothing-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "clothing")}
          />
          <label htmlFor="clothing-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              startIcon={<Upload size={16} />}
              sx={{ mb: 1 }}
              disabled={!hasAvatar}
            >
              {hasClothing ? "Replace Clothing" : "Upload Clothing"}
            </Button>
          </label>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Scene Options
        </Typography>

        <FormControlLabel
          control={<Switch checked={showClothing} onChange={onToggleClothing} disabled={!hasClothing} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {showClothing ? <Visibility size={16} /> : <ViewIconOff size={16} />}
              <Typography sx={{ ml: 1 }}>{showClothing ? "Hide Clothing" : "Show Clothing"}</Typography>
            </Box>
          }
          sx={{ mb: 1 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Clothing Adjustment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          For best results, upload models that are designed to fit together. Different models may require manual
          adjustment in a 3D editor.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<Refresh size={16} />}
        onClick={onResetScene}
        disabled={!hasAvatar && !hasClothing}
      >
        Reset Scene
      </Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Instructions:
        </Typography>
        <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
          <li>Upload an avatar model (GLB/GLTF)</li>
          <li>Upload clothing to fit on the avatar</li>
          <li>Use mouse to rotate, zoom, and pan</li>
          <li>Toggle clothing visibility with the switch</li>
        </Typography>
      </Box>
    </Paper>
  )
}
