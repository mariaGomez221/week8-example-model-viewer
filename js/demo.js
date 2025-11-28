// Interactive Model Viewer Demo Controller
document.addEventListener('DOMContentLoaded', function() {
  const viewer = document.getElementById('demo-viewer');
  if (!viewer) return;

  // Store initial values for reset
  const initialValues = {
    src: viewer.getAttribute('src') || 'assets/strawberry.glb',
    cameraControls: viewer.hasAttribute('camera-controls'),
    autoRotate: viewer.hasAttribute('auto-rotate'),
    autoRotateDelay: '3000',
    ar: viewer.hasAttribute('ar'),
    exposure: viewer.getAttribute('exposure') || '1',
    shadowIntensity: viewer.getAttribute('shadow-intensity') || '1',
    environmentImage: viewer.getAttribute('environment-image') || 'neutral',
    scale: '1',
    rotationX: '0',
    rotationY: '0',
    rotationZ: '0',
    backgroundColor: '#f8f8f8',
    backgroundImage: ''
  };

  // Model Selection
  const modelSelect = document.getElementById('model-select');
  modelSelect.addEventListener('change', function() {
    viewer.src = this.value;
    // Reapply transforms when new model loads
    viewer.addEventListener('load', function applyTransformsOnLoad() {
      applyModelTransform();
      viewer.removeEventListener('load', applyTransformsOnLoad);
    });
  });

  // Camera Controls
  const cameraControls = document.getElementById('camera-controls');
  cameraControls.addEventListener('change', function() {
    if (this.checked) {
      viewer.setAttribute('camera-controls', '');
    } else {
      viewer.removeAttribute('camera-controls');
    }
  });

  // Auto Rotate Delay (declare first so it can be used in autoRotate handler)
  const autoRotateDelay = document.getElementById('auto-rotate-delay');
  const autoRotateDelayValue = document.getElementById('auto-rotate-delay-value');

  // Auto Rotate
  const autoRotate = document.getElementById('auto-rotate');
  autoRotate.addEventListener('change', function() {
    if (this.checked) {
      viewer.setAttribute('auto-rotate', '');
      // Ensure delay is set when enabling auto-rotate
      const delayValue = autoRotateDelay.value;
      viewer.setAttribute('auto-rotate-delay', delayValue);
    } else {
      viewer.removeAttribute('auto-rotate');
    }
  });

  // Auto Rotate Delay input handler
  autoRotateDelay.addEventListener('input', function() {
    const value = this.value;
    autoRotateDelayValue.textContent = value;
    // Set delay as number (milliseconds), not string with 'ms'
    viewer.setAttribute('auto-rotate-delay', value);
    // If auto-rotate is enabled, update it to apply the new delay
    if (autoRotate.checked) {
      viewer.removeAttribute('auto-rotate');
      viewer.setAttribute('auto-rotate', '');
    }
  });

  // Camera Target Distance
  const cameraOrbit = document.getElementById('camera-orbit');
  const cameraOrbitValue = document.getElementById('camera-orbit-value');
  cameraOrbit.addEventListener('input', function() {
    const value = parseFloat(this.value);
    cameraOrbitValue.textContent = value.toFixed(1);
    // Set the actual camera distance using camera-orbit attribute
    // Format: "theta phi radius" where radius is the distance in meters
    viewer.setAttribute('camera-orbit', `auto auto ${value}m`);
  });

  // AR Enabled
  const arEnabled = document.getElementById('ar-enabled');
  arEnabled.addEventListener('change', function() {
    if (this.checked) {
      viewer.setAttribute('ar', '');
    } else {
      viewer.removeAttribute('ar');
    }
  });

  // AR Scale
  const arScale = document.getElementById('ar-scale');
  arScale.addEventListener('change', function() {
    if (this.value === 'auto') {
      viewer.removeAttribute('ar-scale');
    } else {
      viewer.setAttribute('ar-scale', this.value);
    }
  });

  // Exposure
  const exposure = document.getElementById('exposure');
  const exposureValue = document.getElementById('exposure-value');
  exposure.addEventListener('input', function() {
    const value = parseFloat(this.value);
    exposureValue.textContent = value.toFixed(1);
    viewer.setAttribute('exposure', value);
  });

  // Shadow Intensity
  const shadowIntensity = document.getElementById('shadow-intensity');
  const shadowIntensityValue = document.getElementById('shadow-intensity-value');
  shadowIntensity.addEventListener('input', function() {
    const value = parseFloat(this.value);
    shadowIntensityValue.textContent = value.toFixed(1);
    viewer.setAttribute('shadow-intensity', value);
  });

  // Environment Image
  const environmentImage = document.getElementById('environment-image');
  environmentImage.addEventListener('change', function() {
    if (this.value) {
      viewer.setAttribute('environment-image', this.value);
    } else {
      viewer.removeAttribute('environment-image');
    }
  });

  // Scale
  const scale = document.getElementById('scale');
  const scaleValue = document.getElementById('scale-value');
  
  // Rotation X
  const rotationX = document.getElementById('rotation-x');
  const rotationXValue = document.getElementById('rotation-x-value');
  
  // Rotation Y
  const rotationY = document.getElementById('rotation-y');
  const rotationYValue = document.getElementById('rotation-y-value');
  
  // Rotation Z
  const rotationZ = document.getElementById('rotation-z');
  const rotationZValue = document.getElementById('rotation-z-value');

  // Helper function to apply transforms to the model
  function applyModelTransform() {
    // Wait for model-viewer to be ready
    if (!viewer.loaded) return;
    
    // Access the Three.js scene
    const scene = viewer.scene || viewer.model;
    if (!scene) return;
    
    const scaleVal = parseFloat(scale.value);
    const rotationXVal = parseFloat(rotationX.value) * (Math.PI / 180); // Convert to radians
    const rotationYVal = parseFloat(rotationY.value) * (Math.PI / 180);
    const rotationZVal = parseFloat(rotationZ.value) * (Math.PI / 180);
    
    // Find the model in the scene (usually the first child or we traverse)
    let model = null;
    if (scene.children && scene.children.length > 0) {
      // Try to find the model mesh
      for (let child of scene.children) {
        if (child.type === 'Group' || child.type === 'Mesh') {
          model = child;
          break;
        }
      }
      // If no specific model found, use the first child
      if (!model && scene.children[0]) {
        model = scene.children[0];
      }
    } else if (scene.scale) {
      // If scene itself is the model
      model = scene;
    }
    
    if (!model) return;
    
    // Apply scale
    if (model.scale) {
      model.scale.set(scaleVal, scaleVal, scaleVal);
    }
    
    // Apply rotation (order: X, Y, Z)
    if (model.rotation) {
      model.rotation.set(rotationXVal, rotationYVal, rotationZVal);
    }
  }

  // Wait for model to load before applying transforms
  function setupModelTransforms() {
    if (viewer.loaded) {
      applyModelTransform();
    } else {
      viewer.addEventListener('load', function() {
        applyModelTransform();
      });
    }
  }

  // Scale input handler
  scale.addEventListener('input', function() {
    const value = parseFloat(this.value);
    scaleValue.textContent = value.toFixed(1);
    applyModelTransform();
  });

  // Rotation X input handler
  rotationX.addEventListener('input', function() {
    const value = this.value;
    rotationXValue.textContent = value + '°';
    applyModelTransform();
  });

  // Rotation Y input handler
  rotationY.addEventListener('input', function() {
    const value = this.value;
    rotationYValue.textContent = value + '°';
    applyModelTransform();
  });

  // Rotation Z input handler
  rotationZ.addEventListener('input', function() {
    const value = this.value;
    rotationZValue.textContent = value + '°';
    applyModelTransform();
  });

  // Setup transforms when model loads
  setupModelTransforms();
  
  // Re-apply transforms when model changes
  viewer.addEventListener('load', function() {
    applyModelTransform();
  });

  // Background Color
  const backgroundColor = document.getElementById('background-color');
  const backgroundColorText = document.getElementById('background-color-text');
  
  backgroundColor.addEventListener('input', function() {
    backgroundColorText.value = this.value;
    updateBackground();
  });

  backgroundColorText.addEventListener('input', function() {
    if (/^#[0-9A-F]{6}$/i.test(this.value)) {
      backgroundColor.value = this.value;
      updateBackground();
    }
  });

  function updateBackground() {
    const color = backgroundColor.value;
    if (backgroundImage.value) {
      viewer.style.background = `url(${backgroundImage.value}) center/cover, ${color}`;
    } else {
      viewer.style.background = color;
    }
  }

  // Background Image
  const backgroundImage = document.getElementById('background-image');
  backgroundImage.addEventListener('input', function() {
    updateBackground();
  });

  // Reset Button
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', function() {
    // Reset model
    modelSelect.value = initialValues.src;
    viewer.src = initialValues.src;

    // Reset camera controls
    cameraControls.checked = initialValues.cameraControls;
    if (initialValues.cameraControls) {
      viewer.setAttribute('camera-controls', '');
    } else {
      viewer.removeAttribute('camera-controls');
    }

    // Reset auto rotate
    autoRotate.checked = initialValues.autoRotate;
    if (initialValues.autoRotate) {
      viewer.setAttribute('auto-rotate', '');
    } else {
      viewer.removeAttribute('auto-rotate');
    }

    // Reset auto rotate delay
    autoRotateDelay.value = initialValues.autoRotateDelay;
    autoRotateDelayValue.textContent = initialValues.autoRotateDelay;
    viewer.setAttribute('auto-rotate-delay', initialValues.autoRotateDelay);

    // Reset camera orbit
    cameraOrbit.value = '1';
    cameraOrbitValue.textContent = '1.0';
    viewer.setAttribute('camera-orbit', 'auto auto 1m');

    // Reset AR
    arEnabled.checked = initialValues.ar;
    if (initialValues.ar) {
      viewer.setAttribute('ar', '');
    } else {
      viewer.removeAttribute('ar');
    }

    arScale.value = 'auto';
    viewer.removeAttribute('ar-scale');

    // Reset exposure
    exposure.value = initialValues.exposure;
    exposureValue.textContent = initialValues.exposure;
    viewer.setAttribute('exposure', initialValues.exposure);

    // Reset shadow intensity
    shadowIntensity.value = initialValues.shadowIntensity;
    shadowIntensityValue.textContent = initialValues.shadowIntensity;
    viewer.setAttribute('shadow-intensity', initialValues.shadowIntensity);

    // Reset environment image
    environmentImage.value = initialValues.environmentImage;
    if (initialValues.environmentImage) {
      viewer.setAttribute('environment-image', initialValues.environmentImage);
    } else {
      viewer.removeAttribute('environment-image');
    }

    // Reset scale
    scale.value = initialValues.scale;
    scaleValue.textContent = initialValues.scale;

    // Reset rotation
    rotationX.value = initialValues.rotationX;
    rotationXValue.textContent = initialValues.rotationX + '°';
    rotationY.value = initialValues.rotationY;
    rotationYValue.textContent = initialValues.rotationY + '°';
    rotationZ.value = initialValues.rotationZ;
    rotationZValue.textContent = initialValues.rotationZ + '°';
    
    // Apply the reset transforms
    applyModelTransform();

    // Reset background
    backgroundColor.value = initialValues.backgroundColor;
    backgroundColorText.value = initialValues.backgroundColor;
    backgroundImage.value = initialValues.backgroundImage;
    viewer.style.background = initialValues.backgroundColor;
  });

  // Initialize range value displays
  autoRotateDelayValue.textContent = autoRotateDelay.value;
  cameraOrbitValue.textContent = cameraOrbit.value;
  exposureValue.textContent = exposure.value;
  shadowIntensityValue.textContent = shadowIntensity.value;
  scaleValue.textContent = scale.value;
});

// Cake Sequence Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
  const klingSection = document.querySelector('.kling-sequence-card');
  const klingImage = document.getElementById('kling-sequence-image');
  const progressBar = document.getElementById('sequence-progress');
  const frameDisplay = document.getElementById('sequence-frame');
  const sequenceSlider = document.getElementById('sequence-slider');
  const sequenceSliderValue = document.getElementById('sequence-slider-value');
  
  if (!klingSection || !klingImage) return;
  
  const totalFrames = 25; // Frames 0-25
  const basePath = 'assets/cake/cake_';
  let isManualControl = false; // Track if user is manually controlling via slider
  
  // Function to update the frame display and image based on frame number
  function setFrame(frameNumber) {
    // Clamp frame number between 0 and totalFrames
    frameNumber = Math.max(0, Math.min(totalFrames, Math.round(frameNumber)));
    
    // Update image source
    const frameString = String(frameNumber).padStart(5, '0');
    klingImage.src = `${basePath}${frameString}.png`;
    
    // Calculate progress (0 to 1)
    const progress = frameNumber / totalFrames;
    
    // Update progress bar
    if (progressBar) {
      progressBar.style.width = (progress * 100) + '%';
    }
    
    // Update frame display
    if (frameDisplay) {
      frameDisplay.textContent = frameNumber;
    }
    
    // Update slider if it exists
    if (sequenceSlider) {
      sequenceSlider.value = frameNumber;
    }
    
    if (sequenceSliderValue) {
      sequenceSliderValue.textContent = frameNumber;
    }
  }
  
  // Function to update the frame based on scroll progress
  function updateFrameFromScroll() {
    // Don't update from scroll if user is manually controlling
    if (isManualControl) return;
    
    const rect = klingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Calculate when section enters viewport (top of section reaches top of viewport)
    // and when it exits (bottom of section reaches top of viewport)
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    const scrollStart = sectionTop - windowHeight; // When section top reaches viewport top
    const scrollEnd = sectionTop + sectionHeight; // When section bottom reaches viewport top
    const scrollRange = scrollEnd - scrollStart;
    
    // Current scroll position
    const currentScroll = window.scrollY;
    
    // Calculate progress (0 to 1) based on scroll position
    let progress = (currentScroll - scrollStart) / scrollRange;
    progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    
    // Map progress to frame number (0 to 25)
    const frameNumber = Math.round(progress * totalFrames);
    
    setFrame(frameNumber);
  }
  
  // Manual slider control
  if (sequenceSlider) {
    sequenceSlider.addEventListener('input', function() {
      isManualControl = true;
      const frameNumber = parseInt(this.value);
      setFrame(frameNumber);
    });
    
    // Reset manual control flag when user releases slider
    sequenceSlider.addEventListener('mouseup', function() {
      // Allow scroll to take over after a short delay
      setTimeout(function() {
        isManualControl = false;
      }, 100);
    });
    
    sequenceSlider.addEventListener('touchend', function() {
      // Allow scroll to take over after a short delay (for touch devices)
      setTimeout(function() {
        isManualControl = false;
      }, 100);
    });
  }
  
  // Update on scroll
  window.addEventListener('scroll', updateFrameFromScroll, { passive: true });
  
  // Initial update
  updateFrameFromScroll();
});

