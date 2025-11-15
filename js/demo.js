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

  // Auto Rotate
  const autoRotate = document.getElementById('auto-rotate');
  autoRotate.addEventListener('change', function() {
    if (this.checked) {
      viewer.setAttribute('auto-rotate', '');
    } else {
      viewer.removeAttribute('auto-rotate');
    }
  });

  // Auto Rotate Delay
  const autoRotateDelay = document.getElementById('auto-rotate-delay');
  const autoRotateDelayValue = document.getElementById('auto-rotate-delay-value');
  autoRotateDelay.addEventListener('input', function() {
    const value = this.value;
    autoRotateDelayValue.textContent = value;
    viewer.setAttribute('auto-rotate-delay', value + 'ms');
  });

  // Camera Target Distance
  const cameraOrbit = document.getElementById('camera-orbit');
  const cameraOrbitValue = document.getElementById('camera-orbit-value');
  cameraOrbit.addEventListener('input', function() {
    const value = parseFloat(this.value);
    cameraOrbitValue.textContent = value.toFixed(1);
    // Adjust minimum camera distance (affects how close the camera can get)
    const radius = Math.max(0.5, value * 1.5); // Convert to reasonable radius in meters
    viewer.setAttribute('min-camera-orbit', `auto auto ${radius}m`);
    viewer.setAttribute('max-camera-orbit', `auto auto ${radius * 3}m`);
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
  scale.addEventListener('input', function() {
    const value = parseFloat(this.value);
    scaleValue.textContent = value.toFixed(1);
    viewer.setAttribute('scale', value);
  });

  // Rotation X
  const rotationX = document.getElementById('rotation-x');
  const rotationXValue = document.getElementById('rotation-x-value');
  rotationX.addEventListener('input', function() {
    const value = this.value;
    rotationXValue.textContent = value + '°';
    updateRotation();
  });

  // Rotation Y
  const rotationY = document.getElementById('rotation-y');
  const rotationYValue = document.getElementById('rotation-y-value');
  rotationY.addEventListener('input', function() {
    const value = this.value;
    rotationYValue.textContent = value + '°';
    updateRotation();
  });

  // Rotation Z
  const rotationZ = document.getElementById('rotation-z');
  const rotationZValue = document.getElementById('rotation-z-value');
  rotationZ.addEventListener('input', function() {
    const value = this.value;
    rotationZValue.textContent = value + '°';
    updateRotation();
  });

  // Update rotation using model-viewer's rotation attribute
  function updateRotation() {
    const x = parseFloat(rotationX.value);
    const y = parseFloat(rotationY.value);
    const z = parseFloat(rotationZ.value);
    // Convert to model-viewer rotation format: "X Y Z" in degrees
    viewer.setAttribute('rotation', `${x} ${y} ${z}`);
  }

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
    viewer.setAttribute('auto-rotate-delay', initialValues.autoRotateDelay + 'ms');

    // Reset camera orbit
    cameraOrbit.value = '1';
    cameraOrbitValue.textContent = '1.0';
    viewer.removeAttribute('min-camera-orbit');
    viewer.removeAttribute('max-camera-orbit');

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
    viewer.setAttribute('scale', initialValues.scale);

    // Reset rotation
    rotationX.value = initialValues.rotationX;
    rotationXValue.textContent = initialValues.rotationX + '°';
    rotationY.value = initialValues.rotationY;
    rotationYValue.textContent = initialValues.rotationY + '°';
    rotationZ.value = initialValues.rotationZ;
    rotationZValue.textContent = initialValues.rotationZ + '°';
    viewer.removeAttribute('rotation');

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

