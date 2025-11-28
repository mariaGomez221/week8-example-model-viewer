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
    let currentRotation = 0;
    let isModelLoaded = false;
    
    // Function to check if section is in viewport
    function isSectionInView() {
      const rect = circusSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Check if section is at least partially visible
      return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Function to update model rotation
    function updateRotation(scrollDelta) {
      if (!isModelLoaded) return;
      
      // Rotation speed - adjust this to make rotation faster/slower
      // Scrolling down (positive delta) = rotate right
      // Scrolling up (negative delta) = rotate left
      const rotationSpeed = 2.0;
      currentRotation += scrollDelta * rotationSpeed;
      
      // Keep rotation within 0-360 range
      currentRotation = ((currentRotation % 360) + 360) % 360;
      
      // Use rotation attribute to rotate the model itself
      // Format: "X Y Z" in degrees, rotating around Y-axis (vertical)
      circusModel.setAttribute('rotation', `0 ${currentRotation.toFixed(1)} 0`);
    }
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
      // Only rotate when section is in view
      if (!isSectionInView() || !isModelLoaded) {
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
      currentRotation = 0;
      // Initialize rotation to 0
      circusModel.setAttribute('rotation', '0 0 0');
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

