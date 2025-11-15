// Main JavaScript for the model viewer page
// Adds basic interactivity and enhancements

document.addEventListener('DOMContentLoaded', () => {
  // Get all model viewers
  const modelViewers = document.querySelectorAll('model-viewer');
  
  // Add loading indicators
  modelViewers.forEach((viewer, index) => {
    // Show loading state
    viewer.addEventListener('load', () => {
      console.log(`Model ${index + 1} loaded successfully`);
      viewer.style.opacity = '1';
      viewer.style.transition = 'opacity 0.5s ease';
    });
    
    // Handle loading progress
    viewer.addEventListener('progress', (event) => {
      const progress = event.detail.totalProgress;
      if (progress < 1) {
        console.log(`Model ${index + 1} loading: ${(progress * 100).toFixed(0)}%`);
      }
    });
    
    // Handle errors
    viewer.addEventListener('error', (event) => {
      console.error(`Error loading model ${index + 1}:`, event.detail);
    });
    
    // Set initial opacity for fade-in effect
    viewer.style.opacity = '0';
    
    // Add hover effect to parent product card
    const productCard = viewer.closest('.product');
    if (productCard) {
      productCard.addEventListener('mouseenter', () => {
        viewer.autoRotate = true;
        viewer.autoRotateDelay = 1000;
      });
      
      productCard.addEventListener('mouseleave', () => {
        viewer.autoRotate = false;
      });
    }
  });
  
  // Add click handler to product cards to view in detail
  const productCards = document.querySelectorAll('.product');
  productCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking on the model-viewer directly
      if (e.target.tagName === 'MODEL-VIEWER') {
        return;
      }
      
      // Get product data from data attributes
      const productId = card.getAttribute('data-product');
      const productTitle = card.getAttribute('data-title');
      const productSrc = card.getAttribute('data-src');
      
      if (productId && productSrc) {
        // Navigate to detail page with product info
        const params = new URLSearchParams({
          id: productId,
          title: productTitle,
          src: productSrc
        });
        window.location.href = `product-detail.html?${params.toString()}`;
      }
    });
    
    // Make product cards more interactive
    card.style.cursor = 'pointer';
    
    // Prevent model-viewer from triggering card click
    const modelViewer = card.querySelector('model-viewer');
    if (modelViewer) {
      modelViewer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Utility function to add hotspots to a model programmatically
function addHotspotToModel(modelViewer, position, normal, title, description) {
  const hotspotId = `hotspot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const button = document.createElement('button');
  button.setAttribute('slot', hotspotId);
  button.setAttribute('data-position', position);
  button.setAttribute('data-normal', normal);
  button.className = 'hotspot';
  button.style.cssText = `
    background-color: rgba(102, 126, 234, 0.8);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 2px solid white;
    cursor: pointer;
    transition: transform 0.2s ease;
  `;
  button.setAttribute('aria-label', title);
  button.title = title;
  
  modelViewer.appendChild(button);
  
  // Add click handler
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    alert(`${title}\n\n${description}`);
    // You could also show a custom tooltip or modal here
  });
  
  // Add hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });
  
  return button;
}

// Example: Add hotspots to a specific model
// Uncomment and modify to use:
/*
const strawberryModel = document.querySelector('model-viewer[src="assets/strawberry.glb"]');
strawberryModel.addEventListener('load', () => {
  addHotspotToModel(
    strawberryModel,
    '0 0.5 0',
    '0 1 0',
    'Top Layer',
    'Beautiful strawberry layer with cream decoration'
  );
});
*/
