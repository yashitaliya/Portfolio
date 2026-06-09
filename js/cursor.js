// Custom Cursor Implementation - Optimized
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.getElementById('cursor');
  const interactiveElements = document.querySelectorAll('a, button, input[type="button"], input[type="submit"], .portfolio-btn, .nav-link, .filter-btn, textarea, input[type="text"], input[type="email"]');
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isActive = false;
  const speed = 0.15; // Faster response
  const trailInterval = 5; // Less trails for better performance
  let lastTrailX = 0;
  let lastTrailY = 0;
  let animationId = null;

  // Track real mouse position with throttling
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create trail effect with distance check
    const distance = Math.sqrt(
      Math.pow(mouseX - lastTrailX, 2) + 
      Math.pow(mouseY - lastTrailY, 2)
    );

    if (distance > trailInterval) {
      createTrail(mouseX, mouseY);
      lastTrailX = mouseX;
      lastTrailY = mouseY;
    }
  });

  // Smooth cursor movement with easing
  function animateCursor() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = cursorX - 12 + 'px';
    cursor.style.top = cursorY - 12 + 'px';

    animationId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Create trail particles - optimized
  function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x - 3 + 'px';
    trail.style.top = y - 3 + 'px';
    document.body.appendChild(trail);

    // Clean up after animation
    setTimeout(() => {
      trail.remove();
    }, 600);
  }

  // Add hover effects to interactive elements with debouncing
  let hoverTimeout = null;
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      cursor.classList.add('active');
      isActive = true;
    });

    el.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        cursor.classList.remove('active');
        isActive = false;
      }, 50);
    });

    // Add click animation
    el.addEventListener('mousedown', () => {
      cursor.classList.add('click');
    });

    el.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
      if (isActive) {
        cursor.classList.add('active');
      }
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  // Handle window blur/focus
  window.addEventListener('blur', () => {
    cursor.style.opacity = '0';
  });

  window.addEventListener('focus', () => {
    cursor.style.opacity = '1';
  });
});
