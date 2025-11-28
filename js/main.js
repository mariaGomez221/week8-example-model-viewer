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
    let lastScrollY = window.scrollY;
    let currentRotationY = 0;
    let scrollTimeout;
    
    // Function to check if section is in viewport
    function isSectionInView() {
      const rect = circusSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Check if section is at least partially visible
      return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Function to update model rotation
    function updateRotation(scrollDelta) {
      if (!isSectionInView()) return;
      
      // Rotation speed (adjust this value to make rotation faster/slower)
      // Positive scrollDelta (scrolling down) = rotate right (positive Y rotation)
      // Negative scrollDelta (scrolling up) = rotate left (negative Y rotation)
      const rotationSpeed = 0.3;
      currentRotationY += scrollDelta * rotationSpeed;
      
      // Keep rotation within 0-360 range for cleaner values
      currentRotationY = currentRotationY % 360;
      if (currentRotationY < 0) currentRotationY += 360;
      
      // Apply rotation to the model (rotation format: "X Y Z" in degrees)
      // Rotating around Y-axis (vertical) for horizontal spinning
      circusModel.setAttribute('rotation', `0 ${currentRotationY} 0`);
    }
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
      if (!isSectionInView()) return;
      
      clearTimeout(scrollTimeout);
      
      // Calculate scroll direction and amount
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Only update rotation if there's actual scroll movement
      if (Math.abs(scrollDelta) > 0) {
        updateRotation(scrollDelta);
      }
      
      lastScrollY = currentScrollY;
      
      // Clear timeout after scrolling stops
      scrollTimeout = setTimeout(function() {
        // Optional: could add any cleanup here if needed
      }, 150);
    });
    
    // Wait for model to load before applying rotation
    circusModel.addEventListener('load', function() {
      // Initialize rotation to 0
      currentRotationY = 0;
      circusModel.setAttribute('rotation', '0 0 0');
    });
  }
});

