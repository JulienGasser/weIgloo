/*********************
*      Slider        *
*********************/

// Gestion des flèches prev/next
const slides = ['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6', 'slide7'];
let currentIndex = 3; // slide4 est checked par défaut

function updateArrows() {
  const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
  const nextIndex = (currentIndex + 1) % slides.length;
  
  document.getElementById('prev').setAttribute('for', slides[prevIndex]);
  document.getElementById('next').setAttribute('for', slides[nextIndex]);
}

// Écouter les changements de radio buttons
slides.forEach((slideId, index) => {
  document.getElementById(slideId).addEventListener('change', () => {
	currentIndex = index;
	updateArrows();
  });
});

// Initialiser les flèches
updateArrows();

// Support tactile pour swipe (optionnel)
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.querySelector('.carousel');

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
	// Swipe gauche -> next
	const nextIndex = (currentIndex + 1) % slides.length;
	document.getElementById(slides[nextIndex]).checked = true;
	currentIndex = nextIndex;
	updateArrows();
  }
  if (touchEndX > touchStartX + 50) {
	// Swipe droite -> prev
	const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
	document.getElementById(slides[prevIndex]).checked = true;
	currentIndex = prevIndex;
	updateArrows();
  }
}