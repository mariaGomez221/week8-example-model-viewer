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

  // Scroll-controlled rotation for Circus Cake
  const circusSection = document.querySelector('.featured-card');
  const circusModel = circusSection?.querySelector('model-viewer');
  
  if (circusModel && circusSection) {
    let lastScrollY = window.scrollY || window.pageYOffset;
    let currentAzimuth = 0;
    let isModelLoaded = false;
    const baseElevation = 60;
    const baseDistance = 105;
    let scrollTimeout;
    const hadCameraControls = circusModel.hasAttribute('camera-controls');
    
    // Get progress bar elements
    const progressBar = document.getElementById('rotation-progress');
    const progressPercentage = document.getElementById('rotation-percentage');
    
    // Function to check if section is in viewport
    function isSectionInView() {
      const rect = circusSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Check if section is at least partially visible
      return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Function to update progress bar
    function updateProgressBar() {
      if (progressBar && progressPercentage) {
        // Calculate percentage (0-360 degrees = 0-100%)
        const percentage = (currentAzimuth / 360) * 100;
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = Math.round(percentage) + '%';
      }
    }
    
    // Function to update model rotation using camera-orbit
    function updateRotation(scrollDelta) {
      if (!isModelLoaded) return;
      
      // Temporarily disable camera-controls to prevent interference
      if (hadCameraControls) {
        circusModel.removeAttribute('camera-controls');
      }
      
      // Rotation speed - adjust this to make rotation faster/slower
      // Scrolling down (positive delta) = rotate right (positive azimuth)
      // Scrolling up (negative delta) = rotate left (negative azimuth)
      const rotationSpeed = 2.0;
      currentAzimuth += scrollDelta * rotationSpeed;
      
      // Keep azimuth within 0-360 range
      currentAzimuth = ((currentAzimuth % 360) + 360) % 360;
      
      // Use camera-orbit to rotate the camera around the model
      // Format: "azimuth elevation distance"
      const orbitValue = `${currentAzimuth.toFixed(1)}deg ${baseElevation}deg ${baseDistance}%`;
      circusModel.setAttribute('camera-orbit', orbitValue);
      
      // Update progress bar
      updateProgressBar();
      
      // Re-enable camera-controls after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (hadCameraControls) {
          circusModel.setAttribute('camera-controls', '');
        }
      }, 200);
    }
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
      const inView = isSectionInView();
      
      // Only rotate when section is in view
      if (!inView || !isModelLoaded) {
        lastScrollY = window.scrollY || window.pageYOffset;
        return;
      }
      
      // Calculate scroll direction and amount
      const currentScrollY = window.scrollY || window.pageYOffset;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Update rotation based on scroll
      if (Math.abs(scrollDelta) > 0) {
        updateRotation(scrollDelta);
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
    
    // Wait for model to load
    function initializeRotation() {
      isModelLoaded = true;
      currentAzimuth = 0;
      
      // Set initial camera-orbit
      circusModel.setAttribute('camera-orbit', `0deg ${baseElevation}deg ${baseDistance}%`);
      
      // Initialize progress bar
      updateProgressBar();
    }
    
    // Check if model is already loaded
    if (circusModel.loaded) {
      initializeRotation();
    } else {
      // Wait for model to load
      circusModel.addEventListener('load', initializeRotation);
      // Also try after a short delay in case load event doesn't fire
      setTimeout(function() {
        if (!isModelLoaded && circusModel.loaded) {
          initializeRotation();
        }
      }, 1000);
    }
  }
});

