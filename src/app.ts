var css = require('./styles/app.scss');

import { Shape, stagger, easing, Timeline, ShapeSwirl, Tween, h } from 'mo-js';
import * as MojsPlayer from 'mojs-player';
import * as Snap from 'snapsvg';

let parentContainer = document.getElementById('c-timeline');
let offScreenY = (parentContainer.clientHeight / 2) - 20;


class TimelineGenerator {
	constructor() {
		let paper = Snap('.line');
		let path = paper.path('M 50,50 C75,80 125,20 150,50').attr({fill: 'none', stroke: '#333', strokeWidth: 1});
		console.log(path);


	}
}

export class Main {
	tl: TimelineGenerator
	init() {
		this.tl = new TimelineGenerator();
	}
}



var main = new Main();
main.init();










