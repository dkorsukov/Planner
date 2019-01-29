import {createDOMElement} from "./helpers.js";

"use strict";

let s = { // window sizes for canvas
	w: window.innerWidth,
	h: window.innerHeight
};

let pageWrapper = document.querySelector(".page-wrapper");

let canvas = createDOMElement("canvas", { // canvas for animations
	class: "page-bg",
	width: s.w,
	height: s.h
});

window.addEventListener("resize", () => {
	[s.w, s.h] = [window.innerWidth, window.innerHeight];
	[canvas.width, canvas.height] = [s.w, s.h]; 
});

pageWrapper.appendChild(canvas);

import addSnowflakes from "./animations/snowflakes.js";
let winterTheme = { // theme for December, January and February
	elemsStyles: {
		fontColor: "#FFFFFF",
		bgColor: "#59A0ED"
	},
	canvasStyles: {
		bg: "linear-gradient(180deg, #4AA0ED, #8AC4FF)",
		objectsColor: "#FFFFFF"
	},
	animation: addSnowflakes,
	metaThemeColor: "#459CDB" // value for "theme-color" meta tag
};

let springTheme = { // theme for Mart, April and May
	elemsStyles: {
		fontColor: "#FFFFFF",
		bgColor: "#36D929"
	},
	canvasStyles: {
		bg: null,
		objectsColor: null
	},
	animation: null,
	metaThemeColor: "#27CA1A" // value for "theme-color" meta tag
};

// settings for themes of other seasons will be added later...

let setTheme = (elems, theme) => { // set theme from theme-object
	canvas.style.background = theme.canvasStyles.bg;
	
	elems.forEach( elem => 	[elem.style.color, elem.style.backgroundColor] =
													[theme.elemsStyles.fontColor, theme.elemsStyles.bgColor] );

	let metaTag = document.head.querySelector("meta[name='theme-color']");
	metaTag.setAttribute("content", theme.metaThemeColor);

	theme.animation.call(null, canvas, theme.canvasStyles.objectsColor); // start animation on canvas
}

let setThemeBySeason = (elemsForSet) => {
	let cm = new Date().getMonth(); // current month

	switch (true) {
		case (cm === 11 || cm === 0 || cm === 1): 
			setTheme(elemsForSet, winterTheme);
		break;
		case (cm === 2 || cm === 3 || cm === 4):
			/* FOR SPRING THEME */
		break;
		case (cm === 5 || cm === 6 || cm === 7):
			/* FOR SUMMER THEME */
		break;
		case (cm === 8 || cm === 9 || cm === 10):
			/* FOR AUTUMN THEME */
		break;	
		default: 
			throw new Error("Unexpected Error");
		break;		  
	}
}

export default setThemeBySeason;