// Product Detail Page JavaScript
// Handles product loading, hotspots, and model customization

const modelViewer = document.querySelector('#detail-model-viewer');
const productTitle = document.getElementById('product-title');
const hotspotTooltip = document.getElementById('hotspot-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDescription = document.getElementById('tooltip-description');
const tooltipActions = document.getElementById('tooltip-actions');

// Product-specific hotspot configurations
const productHotspots = {
  strawberry: [
    {
      position: '0 0.6 0',
      normal: '0 1 0',
      title: 'Top Layer',
      description: 'Beautiful strawberry top layer with fresh cream decoration. Click to change color!',
      actions: [
        { label: 'Change to Pink', action: () => changeModelColor('#ffb6c1') },
        { label: 'Change to Red', action: () => changeModelColor('#ff6b6b') },
        { label: 'Reset Color', action: () => resetModelColor() }
      ]
    },
    {
      position: '0.3 0.3 0.3',
      normal: '1 0 0',
      title: 'Middle Layer',
      description: 'Vanilla sponge cake with strawberry jam filling. Adjust lighting to see details better!',
      actions: [
        { label: 'Increase Exposure', action: () => adjustExposure(0.3) },
        { label: 'Decrease Exposure', action: () => adjustExposure(-0.3) },
        { label: 'Reset Lighting', action: () => resetLighting() }
      ]
    },
    {
      position: '-0.3 0.1 -0.3',
      normal: '-1 0 0',
      title: 'Base Layer',
      description: 'Sturdy base layer with decorative elements. Try different environments!',
      actions: [
        { label: 'Studio Environment', action: () => setEnvironment('studio') },
        { label: 'Sunrise Environment', action: () => setEnvironment('sunrise') },
        { label: 'Neutral Environment', action: () => setEnvironment('neutral') }
      ]
    }
  ],
  chocolate: [
    {
      position: '0 0.6 0',
      normal: '0 1 0',
      title: 'Chocolate Frosting',
      description: 'Rich chocolate frosting layer. Customize the color!',
      actions: [
        { label: 'Dark Chocolate', action: () => changeModelColor('#3d2817') },
        { label: 'Milk Chocolate', action: () => changeModelColor('#7b3f00') },
        { label: 'Reset Color', action: () => resetModelColor() }
      ]
    },
    {
      position: '0 0.2 0.4',
      normal: '0 0 1',
      title: 'Cake Layers',
      description: 'Multiple layers of chocolate cake. Adjust shadows!',
      actions: [
        { label: 'Strong Shadows', action: () => setShadowIntensity(1.5) },
        { label: 'Soft Shadows', action: () => setShadowIntensity(0.5) },
        { label: 'Reset Shadows', action: () => setShadowIntensity(1.0) }
      ]
    }
  ],
  flower: [
    {
      position: '0 0.7 0',
      normal: '0 1 0',
      title: 'Flower Decorations',
      description: 'Beautiful flower decorations on top. Change background to highlight!',
      actions: [
        { label: 'Light Background', action: () => changeBackground('#ffffff') },
        { label: 'Dark Background', action: () => changeBackground('#2d3748') },
        { label: 'Gradient Background', action: () => changeBackground('gradient') }
      ]
    },
    {
      position: '0.4 0.4 0',
      normal: '1 0 0',
      title: 'Side Decorations',
      description: 'Elegant side decorations. Try different camera angles!',
      actions: [
        { label: 'Front View', action: () => setCameraView('front') },
        { label: 'Side View', action: () => setCameraView('side') },
        { label: 'Top View', action: () => setCameraView('top') }
      ]
    }
  ],
  carousel: [
    {
      position: '0 0.8 0',
      normal: '0 1 0',
      title: 'Carousel Top',
      description: 'Decorative carousel top. Enhance with better lighting!',
      actions: [
        { label: 'Bright Lighting', action: () => adjustExposure(0.5) },
        { label: 'Dramatic Lighting', action: () => setShadowIntensity(1.5) },
        { label: 'Reset', action: () => resetLighting() }
      ]
    }
  ],
  macarons: [
    {
      position: '0 0.6 0',
      normal: '0 1 0',
      title: 'Macarons',
      description: 'Colorful macarons decoration. Change colors!',
      actions: [
        { label: 'Vibrant Colors', action: () => changeModelColor('#ff6b9d') },
        { label: 'Pastel Colors', action: () => changeModelColor('#ffb3d9') },
        { label: 'Reset', action: () => resetModelColor() }
      ]
    }
  ],
  pear: [
    {
      position: '0 0.6 0',
      normal: '0 1 0',
      title: 'Pear Decorations',
      description: 'Fresh pear decorations. Adjust environment!',
      actions: [
        { label: 'Natural Light', action: () => setEnvironment('sunrise') },
        { label: 'Studio Light', action: () => setEnvironment('studio') },
        { label: 'Neutral', action: () => setEnvironment('neutral') }
      ]
    }
  ],
  wedding: [
    {
      position: '0 1.0 0',
      normal: '0 1 0',
      title: 'Wedding Topper',
      description: 'Elegant wedding cake topper. Perfect for special occasions!',
      actions: [
        { label: 'Elegant Lighting', action: () => setEnvironment('studio') },
        { label: 'Bright Lighting', action: () => adjustExposure(0.4) },
        { label: 'Reset', action: () => resetAll() }
      ]
    },
    {
      position: '0 0.5 0.4',
      normal: '0 0 1',
      title: 'Tiered Layers',
      description: 'Multi-tiered wedding cake layers. View from different angles!',
      actions: [
        { label: 'Front View', action: () => setCameraView('front') },
        { label: 'Side View', action: () => setCameraView('side') },
        { label: '360° View', action: () => enableAutoRotate() }
      ]
    }
  ],
  blackforest: [
    {
      position: '0 0.6 0',
      normal: '0 1 0',
      title: 'Chocolate Shavings',
      description: 'Dark chocolate shavings on top. Perfect for chocolate lovers!',
      actions: [
        { label: 'Dark Theme', action: () => changeBackground('#1a1a2e') },
        { label: 'Light Theme', action: () => changeBackground('#ffffff') },
        { label: 'Reset', action: () => changeBackground('#f5f7fa') }
      ]
    }
  ],
  lantern: [
    {
      position: '0 0.7 0',
      normal: '0 1 0',
      title: 'Lantern Design',
      description: 'Unique lantern-style cake design. Highlight details!',
      actions: [
        { label: 'Increase Exposure', action: () => adjustExposure(0.4) },
        { label: 'Strong Shadows', action: () => setShadowIntensity(1.5) },
        { label: 'Reset', action: () => resetLighting() }
      ]
    }
  ]
};

// Store original model state
let originalMaterials = [];
let originalExposure = 1;
let originalShadowIntensity = 1;
let originalBackground = '#f5f7fa';
let originalEnvironment = 'neutral';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadProductFromURL();
});

// Load product from URL parameters
function loadProductFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const title = urlParams.get('title');
  const src = urlParams.get('src');

  if (productId && src) {
    // Set product title
    if (title) {
      productTitle.textContent = title;
      document.title = `${title} - Interactive View`;
    }

    // Load model
    modelViewer.src = src;

    // Setup hotspots for this product
    modelViewer.addEventListener('load', () => {
      setupHotspots(productId);
      // Wait a bit for model to fully initialize
      setTimeout(() => {
        saveOriginalState();
      }, 500);
    });
  } else {
    // Default to strawberry if no params
    productTitle.textContent = 'Strawberry Cake';
    modelViewer.src = 'assets/strawberry.glb';
    modelViewer.addEventListener('load', () => {
      setupHotspots('strawberry');
      // Wait a bit for model to fully initialize
      setTimeout(() => {
        saveOriginalState();
      }, 500);
    });
  }
}

// Setup hotspots for a product
function setupHotspots(productId) {
  const hotspots = productHotspots[productId] || productHotspots.strawberry;

  // Clear existing hotspots
  const existingHotspots = modelViewer.querySelectorAll('button[slot^="hotspot"]');
  existingHotspots.forEach(hotspot => hotspot.remove());

  // Create hotspots
  hotspots.forEach((hotspotData, index) => {
    const hotspotId = `hotspot-${index + 1}`;
    const button = document.createElement('button');
    button.setAttribute('slot', hotspotId);
    button.setAttribute('data-position', hotspotData.position);
    button.setAttribute('data-normal', hotspotData.normal);
    button.setAttribute('aria-label', hotspotData.title);
    button.title = hotspotData.title;
    button.className = 'hotspot-button';
    
    // Style hotspot
    button.style.cssText = `
      background-color: rgba(102, 126, 234, 0.8);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      border: 3px solid white;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;

    modelViewer.appendChild(button);

    // Add click handler
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      showHotspotTooltip(hotspotData, button);
    });

    // Add hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.4)';
      button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.6)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
    });
  });

  // Close tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hotspot-button') && !e.target.closest('#hotspot-tooltip')) {
      closeHotspotTooltip();
    }
  });
}

// Show hotspot tooltip
function showHotspotTooltip(hotspotData, hotspotElement) {
  tooltipTitle.textContent = hotspotData.title;
  tooltipDescription.textContent = hotspotData.description;

  // Clear and populate actions
  tooltipActions.innerHTML = '';
  if (hotspotData.actions && hotspotData.actions.length > 0) {
    hotspotData.actions.forEach(actionData => {
      const button = document.createElement('button');
      button.textContent = actionData.label;
      button.className = 'tooltip-action-button';
      button.onclick = () => {
        actionData.action();
        // Optionally close tooltip after action
        // closeHotspotTooltip();
      };
      tooltipActions.appendChild(button);
    });
  }

  // Position tooltip
  const rect = hotspotElement.getBoundingClientRect();
  const modelRect = modelViewer.getBoundingClientRect();
  const tooltipRect = hotspotTooltip.getBoundingClientRect();

  // Position near hotspot
  let left = rect.left - modelRect.left + rect.width / 2;
  let top = rect.top - modelRect.top - 10;

  // Adjust if tooltip goes off screen
  if (left + tooltipRect.width / 2 > modelRect.width) {
    left = modelRect.width - tooltipRect.width / 2 - 10;
  }
  if (left - tooltipRect.width / 2 < 0) {
    left = tooltipRect.width / 2 + 10;
  }

  hotspotTooltip.style.left = left + 'px';
  hotspotTooltip.style.top = top + 'px';
  hotspotTooltip.style.transform = 'translate(-50%, -100%)';
  hotspotTooltip.classList.add('visible');
}

// Close hotspot tooltip
function closeHotspotTooltip() {
  hotspotTooltip.classList.remove('visible');
}

// Model customization functions
function changeModelColor(color) {
  if (!modelViewer.model) {
    console.log('Model not loaded yet');
    return;
  }

  const rgb = hexToRgb(color);
  if (!rgb) return;

  try {
    // Access materials through Three.js scene
    modelViewer.model.traverse((node) => {
      if (node.isMesh && node.material) {
        // Handle both single material and array of materials
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        
        materials.forEach(material => {
          if (material.color) {
            // Three.js material color property
            material.color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
          }
          
          // Also try to access baseColor if it's a MeshStandardMaterial or similar
          if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
            if (material.color) {
              material.color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
            }
          }
        });
      }
    });
  } catch (e) {
    console.log('Could not change model color:', e);
  }
}

function resetModelColor() {
  if (!modelViewer.model || originalMaterials.length === 0) {
    console.log('Cannot reset: model not loaded or no original materials saved');
    return;
  }

  try {
    let materialIndex = 0;
    modelViewer.model.traverse((node) => {
      if (node.isMesh && node.material && materialIndex < originalMaterials.length) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        
        materials.forEach(material => {
          if (originalMaterials[materialIndex] && material.color) {
            const color = originalMaterials[materialIndex];
            material.color.setRGB(color[0], color[1], color[2]);
            materialIndex++;
          }
        });
      }
    });
  } catch (e) {
    console.log('Could not reset model color:', e);
  }
}

function adjustExposure(amount) {
  const current = parseFloat(modelViewer.exposure) || 1;
  const newValue = Math.max(0, Math.min(2, current + amount));
  modelViewer.exposure = newValue;
  document.getElementById('exposure').value = newValue;
  document.getElementById('exposure-value').textContent = newValue.toFixed(1);
}

function setShadowIntensity(value) {
  modelViewer.shadowIntensity = value;
  document.getElementById('shadow-intensity').value = value;
  document.getElementById('shadow-value').textContent = value.toFixed(1);
}

function setEnvironment(env) {
  const envMap = {
    neutral: 'neutral',
    studio: 'https://modelviewer.dev/shared-assets/environments/studio_country_hall_1k.hdr',
    sunrise: 'https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr',
    workshop: 'https://modelviewer.dev/shared-assets/environments/aircraft_workshop_01_1k.hdr'
  };

  const envValue = envMap[env] || 'neutral';
  modelViewer.environmentImage = envValue;
  
  // Update dropdown to match
  const envSelect = document.getElementById('environment');
  if (envSelect) {
    // Find the option that matches
    for (let option of envSelect.options) {
      if (option.value === envValue) {
        envSelect.value = envValue;
        break;
      }
    }
  }
}

function changeBackground(color) {
  if (color === 'gradient') {
    modelViewer.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    document.getElementById('background-color').value = '#f5f7fa';
  } else {
    modelViewer.style.backgroundColor = color;
    document.getElementById('background-color').value = color;
  }
}

function enableAutoRotate() {
  modelViewer.autoRotate = true;
  document.getElementById('auto-rotate').checked = true;
}

function resetLighting() {
  modelViewer.exposure = originalExposure;
  modelViewer.shadowIntensity = originalShadowIntensity;
  document.getElementById('exposure').value = originalExposure;
  document.getElementById('exposure-value').textContent = originalExposure.toFixed(1);
  document.getElementById('shadow-intensity').value = originalShadowIntensity;
  document.getElementById('shadow-value').textContent = originalShadowIntensity.toFixed(1);
}

function saveOriginalState() {
  originalExposure = parseFloat(modelViewer.exposure) || 1;
  originalShadowIntensity = parseFloat(modelViewer.shadowIntensity) || 1;
  originalBackground = modelViewer.style.backgroundColor || window.getComputedStyle(modelViewer).backgroundColor || '#f5f7fa';
  originalEnvironment = modelViewer.environmentImage || 'neutral';

  // Save material colors from Three.js scene
  if (modelViewer.model) {
    try {
      originalMaterials = [];
      modelViewer.model.traverse((node) => {
        if (node.isMesh && node.material) {
          // Handle both single material and array of materials
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          
          materials.forEach(material => {
            if (material.color) {
              // Save Three.js color as RGB array [r, g, b]
              const color = material.color;
              originalMaterials.push([color.r, color.g, color.b]);
            } else {
              originalMaterials.push([1, 1, 1]); // Default white
            }
          });
        }
      });
      
      if (originalMaterials.length === 0) {
        console.log('No materials found to save');
      }
    } catch (e) {
      console.log('Could not save material colors:', e);
      originalMaterials = [];
    }
  } else {
    console.log('Model not loaded yet, cannot save material colors');
  }
}

// Utility functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Control panel functions
function setCameraView(view) {
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
  modelViewer.cameraTarget = '0m 0m 0m';
}

function resetCamera() {
  modelViewer.cameraOrbit = '0deg 75deg 105%';
  modelViewer.cameraTarget = '0m 0m 0m';
  modelViewer.fieldOfView = '45deg';
}

function toggleAutoRotate() {
  const checkbox = document.getElementById('auto-rotate');
  modelViewer.autoRotate = checkbox.checked;
}

function updateExposure(value) {
  modelViewer.exposure = value;
  document.getElementById('exposure-value').textContent = parseFloat(value).toFixed(1);
}

function updateShadowIntensity(value) {
  modelViewer.shadowIntensity = value;
  document.getElementById('shadow-value').textContent = parseFloat(value).toFixed(1);
}

function updateEnvironment(envValue) {
  if (envValue === 'neutral') {
    modelViewer.environmentImage = 'neutral';
  } else {
    modelViewer.environmentImage = envValue;
  }
}

function updateBackgroundColor(color) {
  modelViewer.style.backgroundColor = color;
}

function resetAll() {
  resetCamera();
  resetLighting();
  resetModelColor();
  changeBackground(originalBackground);
  setEnvironment('neutral');
  document.getElementById('environment').value = 'neutral';
  document.getElementById('background-color').value = originalBackground;
  document.getElementById('auto-rotate').checked = true;
  toggleAutoRotate();
  closeHotspotTooltip();
}

// Export functions for global access
window.setCameraView = setCameraView;
window.resetCamera = resetCamera;
window.toggleAutoRotate = toggleAutoRotate;
window.updateExposure = updateExposure;
window.updateShadowIntensity = updateShadowIntensity;
window.updateEnvironment = updateEnvironment;
window.updateBackgroundColor = updateBackgroundColor;
window.resetAll = resetAll;
window.closeHotspotTooltip = closeHotspotTooltip;

