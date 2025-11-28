// Interactive Model Viewer Demo Controller
document.addEventListener('DOMContentLoaded', function() {
  const viewer = document.getElementById('demo-viewer');
  if (!viewer) return;

  // Store initial values for reset
  const initialValues = {
    src: viewer.getAttribute('src') || 'assets/strawberry.glb',
    cameraControls: viewer.hasAttribute('camera-controls'),
    exposure: viewer.getAttribute('exposure') || '1',
    shadowIntensity: viewer.getAttribute('shadow-intensity') || '1',
    backgroundColor: '#f8f8f8'
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

  // Background Color
  const backgroundColor = document.getElementById('background-color');
  const backgroundColorText = document.getElementById('background-color-text');
  
  backgroundColor.addEventListener('input', function() {
    backgroundColorText.value = this.value;
    updateBackground();
  });

  backgroundColorText.addEventListener('input', function() {
    // Validate hex color format using regular expression
    // /^#[0-9A-F]{6}$/i means: starts with #, followed by exactly 6 hex digits (0-9, A-F)
    // The 'i' makes it case-insensitive (accepts both uppercase and lowercase)
    const isValidHexColor = /^#[0-9A-F]{6}$/i.test(this.value);
    
    if (isValidHexColor) {
      backgroundColor.value = this.value;
      updateBackground();
    }
  });

  function updateBackground() {
    const color = backgroundColor.value;
    viewer.style.background = color;
  }

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

    // Reset camera orbit
    cameraOrbit.value = '1';
    cameraOrbitValue.textContent = '1.0';
    viewer.setAttribute('camera-orbit', 'auto auto 1m');

    // Reset exposure
    exposure.value = initialValues.exposure;
    exposureValue.textContent = initialValues.exposure;
    viewer.setAttribute('exposure', initialValues.exposure);

    // Reset shadow intensity
    shadowIntensity.value = initialValues.shadowIntensity;
    shadowIntensityValue.textContent = initialValues.shadowIntensity;
    viewer.setAttribute('shadow-intensity', initialValues.shadowIntensity);

    // Reset background
    backgroundColor.value = initialValues.backgroundColor;
    backgroundColorText.value = initialValues.backgroundColor;
    viewer.style.background = initialValues.backgroundColor;
  });

  // Initialize range value displays
  cameraOrbitValue.textContent = cameraOrbit.value;
  exposureValue.textContent = exposure.value;
  shadowIntensityValue.textContent = shadowIntensity.value;
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
  
  // ============================================
  // Helper Functions for Frame Animation
  // ============================================
  
  // Convert frame number to a string with leading zeros
  // Example: frame 5 becomes "00005", frame 12 becomes "00012"
  // This matches the image file naming: cake_00000.png, cake_00001.png, etc.
  function formatFrameNumber(frameNumber) {
    // padStart(5, '0') adds zeros to the front until the string is 5 characters long
    // Example: "5" becomes "00005", "12" becomes "00012"
    return String(frameNumber).padStart(5, '0');
  }
  
  // Update all visual elements to show a specific frame
  function setFrame(frameNumber) {
    // Make sure frame number is a whole number between 0 and totalFrames
    frameNumber = Math.round(frameNumber); // Round to nearest whole number
    frameNumber = Math.max(0, Math.min(totalFrames, frameNumber)); // Keep between 0 and 25
    
    // Update the image source to show the correct frame
    // Format: "assets/cake/cake_00000.png", "assets/cake/cake_00001.png", etc.
    const frameString = formatFrameNumber(frameNumber);
    klingImage.src = `${basePath}${frameString}.png`;
    
    // Calculate progress as a decimal (0.0 to 1.0)
    // Example: frame 12 out of 25 = 12/25 = 0.48 (48%)
    const progress = frameNumber / totalFrames;
    
    // Update the progress bar width (convert 0-1 to 0-100%)
    if (progressBar) {
      progressBar.style.width = (progress * 100) + '%';
    }
    
    // Update the frame number display text
    if (frameDisplay) {
      frameDisplay.textContent = frameNumber;
    }
    
    // Update the slider position to match the current frame
    if (sequenceSlider) {
      sequenceSlider.value = frameNumber;
    }
    
    // Update the slider value display
    if (sequenceSliderValue) {
      sequenceSliderValue.textContent = frameNumber;
    }
  }
  
  // ============================================
  // Scroll-Based Animation
  // ============================================
  // This function calculates which frame to show based on scroll position
  
  // Calculate the scroll range where animation should happen
  function getScrollRange() {
    // Get the position and size of the animation section
    const rect = klingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Calculate where the section is on the page (including scrolled distance)
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    
    // Animation starts when: section top reaches the top of the viewport
    // This happens when user has scrolled enough that sectionTop equals window.scrollY + windowHeight
    const scrollStart = sectionTop - windowHeight;
    
    // Animation ends when: section bottom reaches the top of the viewport
    const scrollEnd = sectionTop + sectionHeight;
    
    // Total scroll distance over which animation happens
    const scrollRange = scrollEnd - scrollStart;
    
    return {
      scrollStart: scrollStart,
      scrollEnd: scrollEnd,
      scrollRange: scrollRange
    };
  }
  
  // Calculate which frame to show based on current scroll position
  function calculateFrameFromScroll() {
    const range = getScrollRange();
    const currentScroll = window.scrollY;
    
    // Calculate how far through the animation we are (0.0 to 1.0)
    // Example: if we're halfway through the scroll range, progress = 0.5
    let progress = (currentScroll - range.scrollStart) / range.scrollRange;
    
    // Make sure progress stays between 0 and 1 (in case user scrolls too far)
    progress = Math.max(0, Math.min(1, progress));
    
    // Convert progress (0-1) to frame number (0-25)
    // Example: progress 0.5 with 25 frames = frame 12.5, rounded to 13
    const frameNumber = Math.round(progress * totalFrames);
    
    return frameNumber;
  }
  
  // Main function that updates the frame based on scroll
  function updateFrameFromScroll() {
    // Don't update from scroll if user is manually controlling the slider
    if (isManualControl) return;
    
    // Calculate which frame to show
    const frameNumber = calculateFrameFromScroll();
    
    // Update the display to show that frame
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

