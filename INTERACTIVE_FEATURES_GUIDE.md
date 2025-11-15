# Interactive Model Viewer Features Guide

This guide explains different ways to present 3D models and information about them using Model Viewer.

## Table of Contents
1. [Hotspots](#hotspots)
2. [Model Customization](#model-customization)
3. [Camera Controls](#camera-controls)
4. [Animation Controls](#animation-controls)
5. [Material Customization](#material-customization)
6. [Advanced Features](#advanced-features)

## Hotspots

Hotspots are interactive points on your 3D model that display information when clicked or hovered.

### Basic Hotspot Implementation

```html
<model-viewer src="assets/model.glb">
  <button
    slot="hotspot-1"
    data-position="0 0.5 0"
    data-normal="0 1 0"
    class="hotspot">
  </button>
</model-viewer>
```

### Programmatic Hotspot Creation

```javascript
function addHotspot(position, normal, title, description) {
  const hotspotId = `hotspot-${Date.now()}`;
  const button = document.createElement('button');
  button.setAttribute('slot', hotspotId);
  button.setAttribute('data-position', position);
  button.setAttribute('data-normal', normal);
  button.className = 'hotspot';
  modelViewer.appendChild(button);
  
  button.addEventListener('click', () => {
    showHotspotInfo(title, description);
  });
}
```

### Hotspot Positioning

- **data-position**: 3D coordinates (x y z) in model space
- **data-normal**: Direction the hotspot faces (affects visibility)
- Use positive Y for top, negative Y for bottom
- Experiment with different positions to find the best spots

### Styling Hotspots

```css
.hotspot {
  background-color: rgba(102, 126, 234, 0.8);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hotspot:hover {
  transform: scale(1.3);
}
```

## Model Customization

### Lighting and Exposure

```javascript
// Adjust exposure (brightness)
modelViewer.exposure = 1.5; // 0 to 2

// Shadow intensity
modelViewer.shadowIntensity = 1.0; // 0 to 2
```

### Environment

Change the lighting environment to affect how the model looks:

```javascript
// Pre-built environments
modelViewer.environmentImage = 'neutral';
modelViewer.environmentImage = 'https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr';

// Custom HDR environment
modelViewer.environmentImage = 'path/to/your/environment.hdr';
```

### Background

```javascript
// Solid color
modelViewer.style.backgroundColor = '#f5f7fa';

// Gradient (via CSS)
modelViewer.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

// Transparent (for AR)
modelViewer.style.backgroundColor = 'transparent';
```

### Camera Controls

```javascript
// Set camera orbit (theta, phi, radius)
modelViewer.cameraOrbit = '0deg 75deg 105%';

// Set camera target (where camera looks)
modelViewer.cameraTarget = '0m 0m 0m';

// Field of view
modelViewer.fieldOfView = '45deg';

// Preset views
function setFrontView() {
  modelViewer.cameraOrbit = '0deg 75deg 105%';
}

function setSideView() {
  modelViewer.cameraOrbit = '90deg 75deg 105%';
}

function setTopView() {
  modelViewer.cameraOrbit = '0deg 0deg 105%';
}
```

### Auto Rotate

```javascript
// Enable/disable auto rotation
modelViewer.autoRotate = true;
modelViewer.autoRotateDelay = 1000; // Delay in ms before starting
```

## Animation Controls

If your model has animations:

```javascript
// Play animation
modelViewer.play();

// Pause animation
modelViewer.pause();

// Check available animations
console.log(modelViewer.availableAnimations);

// Play specific animation
modelViewer.animationName = 'animation-name';

// Animation time (0 to 1)
modelViewer.timeScale = 1.0;
```

## Material Customization

### Changing Material Properties

You can modify materials programmatically:

```javascript
// Wait for model to load
modelViewer.addEventListener('load', () => {
  const model = modelViewer.model;
  const materials = model.materials;
  
  // Modify material properties
  materials.forEach(material => {
    // Change base color
    material.pbrMetallicRoughness.setBaseColorFactor([1, 0, 0, 1]); // Red
    
    // Change metallic factor
    material.pbrMetallicRoughness.setMetallicFactor(0.5);
    
    // Change roughness
    material.pbrMetallicRoughness.setRoughnessFactor(0.3);
  });
});
```

### Color Customization UI

```html
<input type="color" id="color-picker" onchange="changeModelColor(this.value)">
```

```javascript
function changeModelColor(color) {
  const rgb = hexToRgb(color);
  modelViewer.addEventListener('load', () => {
    const materials = modelViewer.model.materials;
    materials.forEach(material => {
      material.pbrMetallicRoughness.setBaseColorFactor([
        rgb.r / 255,
        rgb.g / 255,
        rgb.b / 255,
        1
      ]);
    });
  });
}
```

## Advanced Features

### Model Variants

If your model has variants (different configurations):

```javascript
// Switch between variants
modelViewer.variantName = 'variant-name';
```

### Scene Graph Manipulation

Access and modify the scene graph:

```javascript
modelViewer.addEventListener('load', () => {
  const scene = modelViewer.model;
  
  // Traverse scene graph
  scene.traverse((node) => {
    if (node.isMesh) {
      // Hide/show specific meshes
      node.visible = false;
      
      // Change mesh properties
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
});
```

### Interaction Modes

```javascript
// Interaction policy
modelViewer.interactionPolicy = 'allow-when-focused';

// Camera controls
modelViewer.cameraControls = true;

// Touch action
modelViewer.style.touchAction = 'pan-y';
```

### AR Features

```html
<model-viewer
  src="model.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  ar-scale="auto"
  ar-placement="floor">
</model-viewer>
```

### Loading States

```javascript
modelViewer.addEventListener('progress', (event) => {
  const progress = event.detail.totalProgress;
  console.log(`Loading: ${(progress * 100).toFixed(0)}%`);
});

modelViewer.addEventListener('load', () => {
  console.log('Model loaded');
});
```

## Best Practices

1. **Hotspot Placement**: Test hotspots at different angles to ensure they're visible
2. **Performance**: Limit the number of hotspots for better performance
3. **Accessibility**: Add ARIA labels to hotspots for screen readers
4. **Mobile**: Test on mobile devices - hotspots may need larger touch targets
5. **Loading**: Show loading indicators while models load
6. **Error Handling**: Handle cases where models fail to load

## Example Implementation

See `example-interactive.html` for a complete implementation with:
- Multiple hotspots with information tooltips
- Camera view presets
- Lighting and environment controls
- Animation controls
- Real-time customization

## Resources

- [Model Viewer Documentation](https://modelviewer.dev/)
- [Model Viewer Examples](https://modelviewer.dev/examples/)
- [GLTF Format Specification](https://www.khronos.org/gltf/)

## Troubleshooting

### Hotspots not showing
- Check that `data-position` and `data-normal` are set correctly
- Ensure the hotspot is positioned within the model bounds
- Try different normal vectors

### Materials not changing
- Wait for the model to load before modifying materials
- Check that the material exists in the model
- Verify material property names are correct

### Performance issues
- Reduce model complexity
- Use lower resolution textures
- Limit the number of interactive elements
- Enable `preload` attribute for faster loading

