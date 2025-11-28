// Cake Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Helper function to set up popup for a cake section
  function setupPopup(sectionId, popupId) {
    const section = document.getElementById(sectionId);
    const popup = document.getElementById(popupId);

    if (section && popup) {
      // Open popup when clicking on cake section
      section.addEventListener('click', function(e) {
        e.stopPropagation();
        popup.classList.add('active');
      });

      // Close popup when clicking on the overlay background
      popup.addEventListener('click', function(e) {
        if (e.target === popup) {
          popup.classList.remove('active');
        }
      });

      // Close popup when clicking anywhere else on the document
      document.addEventListener('click', function(e) {
        if (popup.classList.contains('active')) {
          // Close if clicking outside both the popup and the section
          if (!popup.contains(e.target) && !section.contains(e.target)) {
            popup.classList.remove('active');
          }
        }
      });
    }
  }

  // Set up popups for all cake sections
  setupPopup('strawberry-cake-section', 'strawberry-popup');
  setupPopup('chocolate-cake-section', 'chocolate-popup');
  setupPopup('flower-cake-section', 'flower-popup');
  setupPopup('carousel-cake-section', 'carousel-popup');
  setupPopup('macarons-cake-section', 'macarons-popup');
  setupPopup('pear-cake-section', 'pear-popup');
  setupPopup('wedding-cake-section', 'wedding-popup');
  setupPopup('blackforest-cake-section', 'blackforest-popup');
  setupPopup('lantern-cake-section', 'lantern-popup');

  // ============================================
  // Scroll-Controlled Rotation for Circus Cake
  // ============================================
  // This section makes the cake rotate as you scroll the page
  // The rotation is controlled by scroll position and limited to 0-360 degrees
  
  // Find the featured card section and the 3D model inside it
  // The ?. is called "optional chaining" - it safely checks if circusSection exists
  // before trying to find the model-viewer inside it
  const circusSection = document.querySelector('.featured-card');
  const circusModel = circusSection?.querySelector('model-viewer');
  
  // Only set up rotation if both the section and model exist
  if (circusModel && circusSection) {
    // Variables to track scroll and rotation state
    let lastScrollY = window.scrollY || window.pageYOffset; // Last scroll position
    let currentAzimuth = 0; // Current rotation angle (0-360 degrees)
    let isModelLoaded = false; // Whether the 3D model has finished loading
    
    // Camera settings - these control how the camera views the model
    const baseElevation = 60; // How high/low the camera is (60 degrees up)
    const baseDistance = 105; // How far the camera is from the model (105%)
    
    let scrollTimeout; // Used to delay re-enabling camera controls
    
    // Remember if the model had camera-controls originally
    // We temporarily disable them during scroll rotation
    const hadCameraControls = circusModel.hasAttribute('camera-controls');
    
    // Get the progress bar elements to show rotation percentage
    const progressBar = document.getElementById('rotation-progress');
    const progressPercentage = document.getElementById('rotation-percentage');
    
    // ============================================
    // Helper Functions
    // ============================================
    
    // Check if the section is currently visible on screen
    function isSectionInView() {
      const rect = circusSection.getBoundingClientRect(); // Get section position
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Section is in view if its top is above the bottom of the window
      // AND its bottom is below the top of the window
      return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Update the progress bar to show current rotation percentage
    function updateProgressBar() {
      if (progressBar && progressPercentage) {
        // Convert rotation angle (0-360 degrees) to percentage (0-100%)
        const percentage = (currentAzimuth / 360) * 100;
        
        // Make sure percentage stays between 0 and 100
        const clampedPercentage = Math.min(100, Math.max(0, percentage));
        
        // Update the visual progress bar width
        progressBar.style.width = clampedPercentage + '%';
        // Update the text showing the percentage
        progressPercentage.textContent = Math.round(clampedPercentage) + '%';
      }
    }
    
    // Apply the rotation to the 3D model
    function applyRotationToModel() {
      // Create the camera-orbit string: "azimuth elevation distance"
      // azimuth = horizontal rotation (0-360 degrees)
      // elevation = vertical angle (stays at 60 degrees)
      // distance = how far camera is (stays at 105%)
      const orbitValue = `${currentAzimuth.toFixed(1)}deg ${baseElevation}deg ${baseDistance}%`;
      circusModel.setAttribute('camera-orbit', orbitValue);
    }
    
    // ============================================
    // Main Rotation Function
    // ============================================
    // This function updates the rotation based on how much the user scrolled
    function updateRotation(scrollDelta) {
      // Don't do anything if the model hasn't loaded yet
      if (!isModelLoaded) return;
      
      // Temporarily disable camera-controls so our scroll rotation works smoothly
      // Camera-controls would interfere with our programmatic rotation
      if (hadCameraControls) {
        circusModel.removeAttribute('camera-controls');
      }
      
      // Calculate how much to rotate based on scroll
      // scrollDelta: positive = scrolling down, negative = scrolling up
      // rotationSpeed: how fast the model rotates (2.0 means 2 degrees per pixel scrolled)
      const rotationSpeed = 2.0;
      currentAzimuth += scrollDelta * rotationSpeed;
      
      // Keep rotation between 0 and 360 degrees
      // If user scrolls past the limits, stop at 0 or 360
      if (currentAzimuth < 0) {
        currentAzimuth = 0; // Can't go below 0 degrees
      } else if (currentAzimuth > 360) {
        currentAzimuth = 360; // Can't go above 360 degrees (full rotation)
      }
      
      // Apply the rotation to the model
      applyRotationToModel();
      
      // Update the progress bar
      updateProgressBar();
      
      // Re-enable camera-controls after user stops scrolling
      // This allows manual camera control when not scrolling
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (hadCameraControls) {
          circusModel.setAttribute('camera-controls', '');
        }
      }, 200); // Wait 200ms after scrolling stops
    }
    
    // ============================================
    // Scroll Event Handler
    // ============================================
    // This runs every time the user scrolls the page
    window.addEventListener('scroll', function() {
      // Only rotate if the section is visible and model is loaded
      const inView = isSectionInView();
      if (!inView || !isModelLoaded) {
        // Update last scroll position even if we're not rotating
        lastScrollY = window.scrollY || window.pageYOffset;
        return; // Exit early - don't rotate
      }
      
      // Calculate how much the user scrolled since last time
      const currentScrollY = window.scrollY || window.pageYOffset;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Only update rotation if there was actual scrolling
      if (Math.abs(scrollDelta) > 0) {
        updateRotation(scrollDelta);
      }
      
      // Remember this scroll position for next time
      lastScrollY = currentScrollY;
    }, { passive: true }); // passive: true makes scrolling smoother
    
    // ============================================
    // Initialize Rotation System
    // ============================================
    // Set up the rotation system once the model has loaded
    function initializeRotation() {
      isModelLoaded = true; // Mark model as loaded
      currentAzimuth = 0; // Start at 0 degrees (no rotation)
      
      // Set the initial camera position
      circusModel.setAttribute('camera-orbit', `0deg ${baseElevation}deg ${baseDistance}%`);
      
      // Show initial progress (0%)
      updateProgressBar();
    }
    
    // Check if model is already loaded (might load before this script runs)
    if (circusModel.loaded) {
      initializeRotation();
    } else {
      // Wait for the model to finish loading
      circusModel.addEventListener('load', initializeRotation);
      
      // Backup: if the load event doesn't fire, try again after 1 second
      setTimeout(function() {
        if (!isModelLoaded && circusModel.loaded) {
          initializeRotation();
        }
      }, 1000);
    }
  }
});

