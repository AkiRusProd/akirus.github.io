const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
	x: null,
	y: null,

	radius: (canvas.height/200) * (canvas.width/200)
}

window.addEventListener('mousemove',
	function (event) {
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

class Particle {
	constructor (x, y, dirX, dirY, size, color){
		this.x = x;
		this.y = y;
		this.dirX = dirX;
		this.dirY = dirY;
		this.size = size;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
		ctx.fillStyle = '#327a6b';
		ctx.fill();
	}

	update(){

		if (this.x > canvas.width || this.x < 0){
			this.dirX = -this.dirX
		}

		if (this.y > canvas.height || this.y < 0){
			this.dirY = -this.dirY
		}

		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let distance = Math.sqrt(dx*dx + dy*dy);

		if (distance < mouse.radius + this.size){
			if (mouse.x < this.x && this.x < canvas.width - this.size * 10){
				this.x += 5;
				this.dirX = -this.dirX
			}

			if (mouse.x > this.x && this.x > this.size * 10){
				this.x -= 5;
				this.dirX = -this.dirX
			}

			if (mouse.y < this.y && this.y < canvas.width - this.size * 10){
				this.y += 5;
				this.dirY = -this.dirY
			}

			if (mouse.y > this.y && this.y > this.size * 10){
				this.y -= 5;
				this.dirY = -this.dirY
			}
	 
		}

		this.x += this.dirX;
		this.y += this.dirY;

		this.draw();
	}
}

function init() {
	particlesArray = [];

	let numOfParticles = (canvas.height * canvas.width) / 9000;

	for (let i = 0; i < numOfParticles; i++) {
		let size = (Math.random() * 5) + 1;
		let x = (Math.random() * ((innerWidth  - size * 2) - (size * 2)) + size * 2);
		let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
		
		let dirX = (Math.random() * 5) - 2.5;
		let dirY = (Math.random() * 5) - 2.5;

		let color = '#327a6b'

		particlesArray.push(new Particle(x, y, dirX, dirY, size, color));
	}
}


function connect() {
	let opacityValue = 1;

	for (let a = 0; a < particlesArray.length; a++){
		for (let b = a; b < particlesArray.length; b++) {
			let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) 
			+ (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))

			if (distance < (canvas.width/7) * (canvas.height/7)) {
				opacityValue = 1 - (distance/20000);

				ctx.strokeStyle = 'rgba(50,64,79,' + opacityValue + ')';
				ctx.beginPath();
				ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
				ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
				ctx.stroke();
			}
		}

	}
}



function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, innerWidth, innerHeight);

	for (let i = 0; i < particlesArray.length; i++){
		particlesArray[i].update();
	}

	connect();
}

window.addEventListener('resize',
	function() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;

		mouse.radius = ((canvas.height/100) * (canvas.width/100));
		init();
	}
);

window.addEventListener('mouseout',
	function() {
		mouse.x = undefined;
		mouse.y = undefined;
	}
);

init();
animate();