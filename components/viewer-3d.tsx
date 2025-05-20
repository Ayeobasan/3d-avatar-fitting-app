"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  useGLTF,
  Center,
  Environment,
  PerspectiveCamera,
  useProgress,
  Html,
  Loader,
} from "@react-three/drei"
import { Box, CircularProgress, Typography, Alert } from "@mui/material"
import { ErrorBoundary } from "react-error-boundary"


interface ModelProps {
  url: string
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}
function Model({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ModelProps) {
  const [error, setError] = useState(null)
  const { scene } = useGLTF(url)

  if (!url) return null

  if (error) {
    console.error("Error loading model:", error)
    return (
      <Html center>
        <Box sx={{ p: 2, bgcolor: "rgba(255,255,255,0.8)", borderRadius: 1, maxWidth: 300 }}>
          <Typography color="error" variant="body2">
            Error loading model. Please try a different file.
          </Typography>
        </Box>
      </Html>
    )
  } else {
    setError(null)
  }

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />
}

function LoadingScreen() {
  const { progress, errors } = useProgress()

  return (
    <Html center>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          bgcolor: "rgba(255,255,255,0.8)",
          borderRadius: 2,
        }}
      >
        {errors.length > 0 ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading model. Please try a different file.
          </Alert>
        ) : (
          <>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading... {progress.toFixed(0)}%
            </Typography>
          </>
        )}
      </Box>
    </Html>
  )
}

function FallbackComponent({ error }: { error: Error }) {
  return (
    <Box
      sx={{ p: 4, bgcolor: "#f5f5f5", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Alert severity="error">
        <Typography variant="h6">Something went wrong with the 3D viewer</Typography>
        <Typography variant="body2">
          {error.message || "Please try refreshing the page or using a different browser."}
        </Typography>
      </Alert>
    </Box>
  )
}

interface Viewer3DProps {
  avatarUrl: string | null
  clothingUrl: string | null
  showClothing: boolean
  clothingPosition?: [number, number, number]
  clothingScale?: number
}

export default function Viewer3D({
  avatarUrl,
  clothingUrl,
  showClothing,
  clothingPosition = [0, 0, 0],
  clothingScale = 1,
}: Viewer3DProps) {
  const [webGLSupported, setWebGLSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setWebGLSupported(!!gl)
    } catch (e) {
      setWebGLSupported(false)
      console.error("WebGL not supported:", e)
    }
  }, [])

  if (!webGLSupported) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Alert severity="error">
          <Typography variant="h6">WebGL Not Supported</Typography>
          <Typography variant="body2">
            Your browser or device doesn&apos;t support WebGL
            , which is required for 3D rendering. Please try a different
            browser or device.
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "#f5f5f5",
        border: "1px solid #e0e0e0",
        position: "relative",
      }}
    >
      {avatarUrl || clothingUrl ? (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Canvas
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 1.5]}
          >
            <PerspectiveCamera makeDefault position={[0, 1, 3]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <Suspense fallback={<LoadingScreen />}>
              <Center>
                {avatarUrl && <Model url={avatarUrl} position={[0, 0, 0]} scale={1} />}
                {clothingUrl && showClothing && (
                  <Model url={clothingUrl} position={clothingPosition} scale={clothingScale} rotation={[0, 0, 0]} />
                )}
              </Center>

              <Environment preset="city" />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1}
              maxDistance={10}
              makeDefault
            />
          </Canvas>
          <Loader />
        </ErrorBoundary>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
            No 3D Models Loaded
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Upload an avatar and clothing models to view them here.
            <br />
            Supported formats: GLB, GLTF
          </Typography>
        </Box>
      )}
    </Box>
  )
}
