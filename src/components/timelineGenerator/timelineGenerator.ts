import { Shape, stagger, easing, Timeline, ShapeSwirl, Tween, TweenOptions, h, Html } from 'mo-js';
import * as MojsPlayer from 'mojs-player';
import * as Snap from 'snapsvg';

let parentContainer = document.getElementById('c-timeline');
let parentWidth = parentContainer.clientWidth;
let offScreenY = (parentContainer.clientHeight / 2) - 20;


export class TimelineGenerator {
	paper: Snap.Paper;
	currentLineLength = 1;
	currentValidationLineLength = 1;
	itemDistance: number = 100;
	pathSVG: string = `
			M 50 70
			l -25,50
			a 3,3 0 00 -1,2
			L 25 ${parentContainer.clientHeight}`;
	pathLength: number;
	validationPath: any;
	path: any;

	formInputs: any[];

	constructor() {
		this.paper = Snap('.line');
		this.pathLength = Snap.path.getTotalLength(this.pathSVG);
		this.path = this.paper.path(this.pathSVG).attr({ 'stroke-dasharray': this.pathLength, 'stroke-dashoffset': this.pathLength, fill: 'none', stroke: '#e7e7e7', 'stroke-width': 3 });
		this.validationPath = this.paper.path(this.pathSVG).attr({ 'stroke-dasharray': this.pathLength, 'stroke-dashoffset': this.pathLength, fill: 'none', stroke: '#50E3C2', 'stroke-width': 3 });
		this.formInputs = [].slice.call(document.getElementsByTagName('input'));


		setTimeout(() => {
			this.createBubble(50, 0, 20, 1,'#50E3C2');
			this.animateToFirstItem();
		} , 300);

	}

	createBubble(x, y, r, speed, color?) {
		if (!color) {
			let color = '#50E3C2'
		}
		var shape = new Shape({
			parent: parentContainer,
			shape: 'circle',
			radius: r,
			fill: color,
			top: 70,
			speed: speed,
			scale: { 0: 1 },
			easing: easing.quad.inout,
			y: y,
			left: x,
		}).play();
	}

	showInput() {
		if (this.formInputs.length > 0) {
			let element = this.formInputs.shift();
			var html = new Html({
				el: element,
				opacity: { 0: 1, duration: 300, delay: 150 },
				onComplete: () => {
					this.showInput();
				},
			}).play();
			element.addEventListener('blur', this.animateValidationLine);
		}
	}

	animateValidationLine = (el) => {
		let distance = Math.sqrt((25 * 25) + (50 * 50)) + el.target.offsetTop - 77;
		Snap.animate(this.currentValidationLineLength, distance, (t) => {
			this.currentValidationLineLength = t;
			this.validationPath.attr({ 'stroke-dasharray': '' + t + ' ' + (this.pathLength - t) });
		}, 300, easing.cubic.in, () => {
			
		});
	}	

	animateToFirstItem() {
		let distance = Math.sqrt((25 * 25) + (50 * 50));
		this.showInput();
		Snap.animate(this.currentLineLength, this.pathLength, (t) => {
			console.log(t);
			this.currentLineLength = t;
			this.path.attr({ 'stroke-dasharray': '' + t + ' ' + (this.pathLength - t) });
		}, 1200, null, () => {
			this.createBubble(25, 75 + 50, 15, 0.6,'#4A90E2');	
		});
	}

}