// Interactive Model Viewer Demo
// This script handles hotspots, camera controls, and model customization

const modelViewer = document.querySelector('#interactive-model');
const hotspotInfo = document.getElementById('hotspot-info');
const hotspotTitle = document.getElementById('hotspot-title');
const hotspotDescription = document.getElementById('hotspot-description');

// Hotspot data - information to display when hotspots are clicked
const hotspotData = {
  'hotspot-1': {
    title: 'Top Layer',
    description: 'This is the beautiful top layer of the strawberry cake, decorated with fresh strawberries and cream.'
  },
  'hotspot-2': {
    title: 'Middle Section',
    description: 'The middle layer contains rich vanilla sponge cake with strawberry jam filling.'
  },
  'hotspot-3': {
    title: 'Base Layer',
    description: 'A sturdy base layer that provides the foundation for this delicious multi-tiered cake.'
  }
};

// Initialize hotspots when model loads
modelViewer.addEventListener('load', () => {
  console.log('Model loaded');
  setupHotspots();
});

// Setup hotspot interactions
function setupHotspots() {
  const hotspots = modelViewer.querySelectorAll('.hotspot');
  
  hotspots.forEach((hotspot, index) => {
    const slot = hotspot.getAttribute('slot');
    const data = hotspotData[slot];
    
    if (data) {
      // Add click handler
      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        showHotspotInfo(data, hotspot);
      });
      
      // Add hover effect
      hotspot.addEventListener('mouseenter', () => {
        hotspot.style.transform = 'scale(1.3)';
        hotspot.style.transition = 'transform 0.2s ease';
      });
      
      hotspot.addEventListener('mouseleave', () => {
        hotspot.style.transform = 'scale(1)';
      });
    }
  });
  
  // Close hotspot info when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hotspot') && !e.target.closest('#hotspot-info')) {
      hideHotspotInfo();
    }
  });
}

// Show hotspot information
function showHotspotInfo(data, hotspotElement) {
  hotspotTitle.textContent = data.title;
  hotspotDescription.textContent = data.description;
  
  // Get hotspot position on screen
  const rect = hotspotElement.getBoundingClientRect();
  const modelRect = modelViewer.getBoundingClientRect();
  
  // Position tooltip near the hotspot
  hotspotInfo.style.left = (rect.left - modelRect.left + rect.width / 2) + 'px';
  hotspotInfo.style.top = (rect.top - modelRect.top - 10) + 'px';
  hotspotInfo.style.transform = 'translate(-50%, -100%)';
  
  hotspotInfo.classList.add('visible');
  
  // Animate camera to focus on hotspot (optional)
  const position = hotspotElement.getAttribute('data-position');
  if (position) {
    // You can add camera animation here if needed
    // modelViewer.cameraTarget = position;
  }
}

// Hide hotspot information
function hideHotspotInfo() {
  hotspotInfo.classList.remove('visible');
}

// Camera View Controls
function setCameraView(view) {
  const cameraOrbit = modelViewer.getAttribute('camera-orbit') || '0deg 75deg 105%';
  const [theta, phi, radius] = cameraOrbit.split(' ');
  
  switch(view) {
    case 'front':
      modelViewer.cameraOrbit = '0deg 75deg 105%';
      break;
    case 'side':
      modelViewer.cameraOrbit = '90deg 75deg 105%';
      break;
    case 'top':
      modelViewer.cameraOrbit = '0deg 0deg 105%';
      break;
    case 'back':
      modelViewer.cameraOrbit = '180deg 75deg 105%';
      break;
  }
  
  // Smooth camera transition
  modelViewer.cameraTarget = '0m 0m 0m';
}

function resetCamera() {
  modelViewer.cameraOrbit = '0deg 75deg 105%';
  modelViewer.cameraTarget = '0m 0m 0m';
  modelViewer.fieldOfView = '45deg';
}

// Auto Rotate Toggle
function toggleAutoRotate() {
  const checkbox = document.getElementById('auto-rotate');
  modelViewer.autoRotate = checkbox.checked;
}

// Exposure Control
function updateExposure(value) {
  modelViewer.exposure = value;
  document.getElementById('exposure-value').textContent = parseFloat(value).toFixed(1);
}

// Shadow Intensity Control
function updateShadowIntensity(value) {
  modelViewer.shadowIntensity = value;
  document.getElementById('shadow-value').textContent = parseFloat(value).toFixed(1);
}

// Environment Control
function updateEnvironment(envValue) {
  if (envValue === 'neutral') {
    modelViewer.environmentImage = 'neutral';
  } else {
    modelViewer.environmentImage = envValue;
  }
}

// Background Color Control
function updateBackgroundColor(color) {
  modelViewer.style.backgroundColor = color;
}

// Animation Controls
function playAnimation() {
  if (modelViewer.availableAnimations && modelViewer.availableAnimations.length > 0) {
    modelViewer.play();
  } else {
    console.log('No animations available in this model');
  }
}

function pauseAnimation() {
  if (modelViewer.availableAnimations && modelViewer.availableAnimations.length > 0) {
    modelViewer.pause();
  }
}

// Reset All Settings
function resetAll() {
  // Reset camera
  resetCamera();
  
  // Reset exposure
  document.getElementById('exposure').value = 1;
  updateExposure(1);
  
  // Reset shadow intensity
  document.getElementById('shadow-intensity').value = 1;
  updateShadowIntensity(1);
  
  // Reset environment
  document.getElementById('environment').value = 'neutral';
  updateEnvironment('neutral');
  
  // Reset background
  document.getElementById('background-color').value = '#f5f7fa';
  updateBackgroundColor('#f5f7fa');
  
  // Reset auto rotate
  document.getElementById('auto-rotate').checked = true;
  toggleAutoRotate();
  
  // Hide hotspot info
  hideHotspotInfo();
}

// Additional: Listen for model events
modelViewer.addEventListener('model-load', () => {
  console.log('Model geometry loaded');
});

modelViewer.addEventListener('progress', (event) => {
  const progress = event.detail.totalProgress;
  if (progress < 1) {
    console.log(`Loading: ${(progress * 100).toFixed(0)}%`);
  }
});

// Example: Add custom hotspot programmatically
function addCustomHotspot(position, normal, title, description) {
  const hotspotId = `hotspot-${Date.now()}`;
  const button = document.createElement('button');
  button.setAttribute('slot', hotspotId);
  button.setAttribute('data-position', position);
  button.setAttribute('data-normal', normal);
  button.className = 'hotspot';
  button.style.cssText = 'background-color: rgba(102, 126, 234, 0.8); border-radius: 50%; width: 20px; height: 20px; border: 2px solid white; cursor: pointer;';
  
  modelViewer.appendChild(button);
  
  // Add to hotspot data
  hotspotData[hotspotId] = { title, description };
  
  // Setup interactions
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    showHotspotInfo({ title, description }, button);
  });
}

// Export functions for global access
window.setCameraView = setCameraView;
window.resetCamera = resetCamera;
window.toggleAutoRotate = toggleAutoRotate;
window.updateExposure = updateExposure;
window.updateShadowIntensity = updateShadowIntensity;
window.updateEnvironment = updateEnvironment;
window.updateBackgroundColor = updateBackgroundColor;
window.playAnimation = playAnimation;
window.pauseAnimation = pauseAnimation;
window.resetAll = resetAll;
window.addCustomHotspot = addCustomHotspot;

