/**********************
*  Animate snowflake  *
**********************/

const snowflakes = document.querySelectorAll('.snowflake');
const getH = () => window.innerHeight;
const getW = () => window.innerWidth;

const flakes = [];

snowflakes.forEach((flake, i) => {
  flakes.push({
	el: flake,
	x: (Math.random()*0.5+(i%2)*0.5) * getW(),
	y: Math.random() * getH(),
	speedY: 0.15 + Math.random() * 0.25,
	speedX: (Math.random() - 0.5) * 0.04,
  });
});

function animateSnow() {
  if (window.innerWidth < 768) return;
  
  flakes.forEach((flake, i) => {
	flake.y += flake.speedY;
	flake.x += flake.speedX;
	flake.speedX += (Math.random() - 0.5) * 0.01;

	if (flake.y > getH() + 300) {
	  flake.y = - Math.random() * 100;
	  flake.x = (Math.random()*0.5+(i%2)*0.5) * getW();
	  flake.speedX = (Math.random() - 0.5) * 0.04;
	  flake.speedY = 0.15 + Math.random() * 0.25;
	}

	flake.el.style.transform = `translate(${flake.x}px, ${flake.y}px)`;
  });

  requestAnimationFrame(animateSnow);
}

animateSnow();