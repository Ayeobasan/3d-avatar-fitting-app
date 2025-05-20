# 3D Avatar Fitting App

A web application that allows users to upload 3D avatar models and clothing, then fit them together in an interactive 3D scene.

## Features

- Upload 3D avatar models (GLB/GLTF format)
- Upload 3D clothing models (GLB/GLTF format)
- Interactive 3D viewport with orbit controls (zoom, rotate, pan)
- Toggle clothing visibility
- Reset scene functionality
- Responsive design for desktop and mobile
- Loading indicators

## Tech Stack

- Next.js
- React
- Three.js (via React Three Fiber)
- Material UI (MUI)

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone https://github.com/Ayeobasan/3d-avatar-fitting-app.git
   cd 3d-avatar-fitting-app
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a 3D avatar model using the "Upload Avatar" button or by dragging and dropping a file.
2. Upload a clothing model using the "Upload Clothing" button or by dragging and dropping a file.
3. Use the mouse to interact with the 3D scene:
   - Left-click and drag to rotate
   - Right-click and drag to pan
   - Scroll to zoom
4. Toggle clothing visibility with the switch
5. Change the clothing color using the color picker
6. Reset the scene with the "Reset Scene" button

## Project Structure

- `app/page.tsx` - Main application page
- `components/control-panel.tsx` - UI controls for the application
- `components/viewer-3d.tsx` - View and interact with uploaded components
- `components/theme-provider.tsx` - Material UI theme configuration

## Notes

- The application automatically positions clothing on the avatar at a reasonable position
- For best results, use properly scaled 3D models
- Supported file formats: GLB and GLTF
