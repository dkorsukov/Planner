let addSnowflakes = (area, color) => {
	let ctx = area.getContext("2d");

	let snowflake = { // snowflake parameters
		minRadius: 4,
		maxRadius: 9,
		maxSpeed: 5,
		color: color
	};	

	let snowflakesNumber = Math.max( ~~(area.width / 27.4), 40 ),
			snowflakes = [];

	for (let i = 1; i <= snowflakesNumber; i++) {
		snowflakes.push({
			x: Math.random() * area.width,
			y: Math.random() * area.height,
			radius: Math.random() * (snowflake.maxRadius - snowflake.minRadius) + snowflake.minRadius,
			speed: Math.random() * snowflake.maxSpeed
		});		
	}		

	let drawSnowflakes = () => {
		ctx.clearRect(0, 0, area.width, area.height);
		ctx.beginPath();

		for (let i = 0; i < snowflakes.length; i++) {
			let s = snowflakes[i]; // current item
			
			ctx.moveTo(s.x, s.y);
			ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2, true);
		}

		ctx.closePath();

		ctx.fillStyle = snowflake.color;
		ctx.fill();

		updateSnowflakes();
		requestAnimationFrame(drawSnowflakes);
	}	

	let angle = 0;

	let updateSnowflakes = () => {
		angle += 0.005;

		if (angle > 1) {
			angle = 1;
		}

		for (let i = 0; i < snowflakes.length; i++) {
			let s = snowflakes[i]; // current item

			snowflakes[i].x += Math.cos(angle) + s.speed;
			snowflakes[i].y += Math.sin(angle) + s.speed * 1.5;

			if (s.x > area.width + 15 || s.y > area.height + 15) { // if snowflake isn't in the viewport
				snowflakes[i] = { ...snowflakes[i], 
													x: Math.random() * (area.width + area.width / 2) - area.width / 2, 
													y: -snowflake.maxRadius }; // enter from left side
			}			
		}
	}

	requestAnimationFrame(drawSnowflakes);	
}

export default addSnowflakes;