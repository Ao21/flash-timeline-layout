var css = require('./styles/app.scss');

import { Shape, stagger, easing, Timeline, ShapeSwirl, Tween, h } from 'mo-js';
import * as MojsPlayer from 'mojs-player';
import * as Snap from 'snapsvg';

let parentContainer = document.getElementById('c-timeline');
let parentWidth = parentContainer.clientWidth;
let offScreenY = (parentContainer.clientHeight / 2) - 20;


class TimelineGenerator {
	paper: Snap.Paper;
	currentLineLength = 1;
	itemDistance: number = 100;
	pathSVG: string = `
			m ${parentWidth * .65} 100
			l -${parentWidth * .15},75
			a 3,3 0 00 -1,2
			L ${parentWidth * .5} 100%`;
	pathLength: number;
	path: any;

	constructor() {
		this.paper = Snap('.line');
		this.pathLength = Snap.path.getTotalLength(this.pathSVG);
		this.path = this.paper.path(this.pathSVG).attr({ 'stroke-dasharray': this.pathLength, 'stroke-dashoffset': this.pathLength, fill: 'none', stroke: '#e7e7e7', 'stroke-width': 3 });

	}

	createBubble(x, y, r) {
		var shape = new Shape({
			parent: parentContainer,
			shape: 'circle',
			radius: r,
			fill: '#EA485C',
			top: 100,
			duration: 150,
			scale: { 0: 1 },
			y: y,
			left: x
		}).play();

		shape.el.addEventListener('click', () => {
			this.animateToFirstItem();
		})
	}

	animateToFirstItem() {
		let distance = Math.sqrt((parentWidth * .15 * parentWidth * .15) + (75 * 75));
		Snap.animate(this.currentLineLength, distance, (t) => {
			this.currentLineLength = t;
			this.path.attr({ 'stroke-dasharray': '' + t + ' ' + (this.pathLength - t) });
		}, distance / 0.3, null, () => {
			this.animateToNextItem(0);
		});

	}

	animateToNextItem(itemDistance) {
		let defaultDistance = Math.sqrt((parentWidth * .15 * parentWidth * .15) + (75 * 75));
		let distance = defaultDistance + itemDistance;
		Snap.animate(this.currentLineLength, distance, (t) => {
			this.currentLineLength = t;
			this.path.attr({ 'stroke-dasharray': '' + t + ' ' + (this.pathLength - t) });
		}, 150, easing.quad.inout, () => {
			this.createBubble(parentWidth * .5, 75 + itemDistance, 15);
			if (this.currentLineLength <= this.pathLength) {
				this.animateToNextItem(itemDistance + 50);	
			}
			
		});
	}
}

export class Main {
	tl: TimelineGenerator = new TimelineGenerator();
	init() {
		setTimeout(() => {
			this.tl.createBubble(parentWidth * .65, 0, 25);
		}, 500);


	}
}



var main = new Main();
main.init();










