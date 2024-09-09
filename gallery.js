// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreen-btn');
const gallery = document.querySelector('.gallery');

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    gallery.requestFullscreen().catch(err => {
      alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Bulk download functionality
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', downloadAllImages);

function downloadAllImages() {
  const images = document.querySelectorAll('.gallery-item');
  images.forEach((img, index) => {
    fetch(img.src)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `image${index + 1}.jpg`; // Customize image name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Download failed:', err));
  });
}

// Image expansion logic
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('expanded-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close');

const images = document.querySelectorAll('.gallery-item');
let currentIndex = 0;

// Function to open the modal with the clicked image
function openModal(index) {
  modal.style.display = 'block';
  modalImg.src = images[index].src;
  captionText.innerHTML = images[index].alt;
  currentIndex = index;
}

// Close the modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Keyboard navigation for desktop users (left/right arrows)
document.addEventListener('keydown', (e) => {
  if (modal.style.display === 'block') {
    if (e.key === 'ArrowRight') {
      navigateRight();
    } else if (e.key === 'ArrowLeft') {
      navigateLeft();
    }
  }
});

// Swipe navigation for mobile users
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

modal.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Helper functions to navigate images
function navigateRight() {
  currentIndex = (currentIndex + 1) % images.length; // Loop back to first image
  modalImg.src = images[currentIndex].src;
  captionText.innerHTML = images[currentIndex].alt;
}

function navigateLeft() {
  currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop back to last image
  modalImg.src = images[currentIndex].src;
  captionText.innerHTML = images[currentIndex].alt;
}

// Handle swipe gesture for mobile devices
function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    navigateRight();
  } else if (touchEndX > touchStartX + 50) {
    navigateLeft();
  }
}

// Attach click event to each image to open modal
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    openModal(index);
  });
});
