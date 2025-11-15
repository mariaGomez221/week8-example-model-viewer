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
});

