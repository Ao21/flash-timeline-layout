var css = require('./animatedLine.scss');

import { Shape, stagger, easing, Timeline, ShapeSwirl, Tween, MotionPath, TweenOptions, h, Html } from 'mo-js';
import * as MojsPlayer from 'mojs-player';

import MojsCurveEditor from 'mojs-curve-editor';
import { Helpers } from './../../common/utils';

let parentContainer = document.getElementById('c-timeline');

let svg: SVGSVGElement = document.querySelector('svg');
let line: SVGSVGElement = document.querySelector('#line');
let animatedLine: SVGPolylineElement = document.querySelector('#animatedLine');
let parentWidth = parentContainer.clientWidth;
let offScreenY = (parentContainer.clientHeight / 2) - 20;

var extremeInElasticOutEasing = easing.path('M0,100 C50,100 50,100 50,50 C50,-15.815625 53.7148438,-19.1218754 60.4981394,0 C62.2625924,4.97393188 66.4286578,6.07928485 68.3303467,0 C71.3633751,-6.23011049 74.5489919,-1.10166123 75.7012545,0 C79.6946191,3.60945678 84.2063904,-0.104182975 84.2063905,0 C87.5409362,-2.25875668 90.4589294,-0.0327241098 93.4950242,0 C97.3271182,0.20445262 100,-0.104182352 100,0');

var bouncyEasing = easing.path('M0,100 C6.50461245,96.8525391 12.6278439,88.3497543 16.6678547,0 C16.6678547,-1.79459817 31.6478577,115.871587 44.1008572,0 C44.1008572,-0.762447191 54.8688736,57.613472 63.0182497,0 C63.0182497,-0.96434046 70.1500549,29.0348701 76.4643231,0 C76.4643231,0 81.9085007,16.5050125 85.8902733,0 C85.8902733,-0.762447191 89.4362183,8.93311024 92.132216,0 C92.132216,-0.156767385 95.0157166,4.59766248 96.918051,0 C96.918051,-0.156767385 98.7040751,1.93815588 100,0');

var customEasing = easing.path('M0, 100 C0, 100 14.514335655913342, 61.87469734359654 15, 70 C15.515767580821981, 78.62893837187244 6.283970521073673, 112.25457688137305 25, 85 C43.71602947892632, 57.745423118626945 30.509948111570534, 105.67804044794632 40, 95 C43.89564629402386, 83.7505309806251 100, 0 100, 0 ');


var DEFAULT_DURATION = 2000;

// const mojsCurve = new MojsCurveEditor;
export class AnimatedLine {

	height = 800;
	segments = 20;
	interval = this.height / this.segments;

	extendedPoint = 3;

	currentLineLength = 0;
	currentLinePosition = 0;
	currentBubblePosition = this.extendedPoint;

	defaultBubble: Shape;
	bubbleCreated: boolean = false;;

	lastSection = 2;

	open = false;

	previousVector: any = { x: 0, y: 0 };


	constructor() {
		this.createStraightLine();
		this.morphToExtended(() => {
			this.displayLine(808, 145, () => {
				this.createBubble(this.currentBubblePosition, () => {
					this.moveBubbleDown();
				})
				// this.displayLine(145, 0, () => {
				// 	// this.morphBack();
				// });
			});
		});
	}

	moveBubbleDown() {
		if (this.currentBubblePosition === this.extendedPoint) {
			let oldPoint = animatedLine.points.getItem(this.currentBubblePosition);
			let newPoint = animatedLine.points.getItem(this.currentBubblePosition + 1);
			let vector = Helpers.getVectorBetweenPoints(newPoint, oldPoint);
			vector = Helpers.addPoints(this.previousVector, vector)
			this.defaultBubble.setProgress(1).then({
				duration: 350,
				x: { [this.previousVector.x]: vector.x },
				y: { [this.previousVector.y]: vector.y },
				onComplete: () => {
					this.defaultBubble.pause();
					this.previousVector = vector;
					this.currentBubblePosition = this.currentBubblePosition + 1;
					setTimeout(() => {
						this.moveBubbleDown();
					}, 1)
				}
			}).play();
		} else {
			let oldPoint = animatedLine.points.getItem(this.currentBubblePosition);
			let newPoint = animatedLine.points.getItem(19);
			let vector = Helpers.getVectorBetweenPoints(newPoint, oldPoint);
			vector = Helpers.addPoints(this.previousVector, vector)
			this.defaultBubble.setProgress(1).then({
				duration: 800,
				x: { [this.previousVector.x]: vector.x },
				y: { [this.previousVector.y]: vector.y },
				easing: extremeInElasticOutEasing,
				onComplete: () => {
					this.defaultBubble.pause();
				}
			}).play();
		}
	}


	createStraightLine() {
		for (var i = 0; i < this.segments; i++) {
			var point = animatedLine.points.appendItem(svg.createSVGPoint());
			point.y = i * this.interval;
			point.x = 5;
		}
		this.setLineLength(1000);
	}


	setLineLength(length?) {
		let len = length ? length : Helpers.polyLineLength(animatedLine);
		animatedLine.setAttribute('stroke-dasharray', `${len}px`);
		animatedLine.setAttribute('stroke-dashoffset', `${len}px`);
		this.currentLineLength = len;
	}

	animateFromTo(fromValue, toValue, p) {
		let position = 0;
		if (fromValue > toValue) {
			position = fromValue - ((fromValue - toValue) * p);
		} else {
			position = fromValue + ((toValue - fromValue) * p);
		}
		return position;
	}

	displayLine(fromValue, toValue, cb?) {
		let duration = DEFAULT_DURATION * ((fromValue - toValue) / DEFAULT_DURATION);
		if (duration < 0) {
			duration = -duration;
		}
		const tween = new Tween({
			duration: duration,
			delay: 0,
			onUpdate: (ep, p, isForward) => {
				let position = this.animateFromTo(fromValue, toValue, p);
				animatedLine.setAttribute('stroke-dashoffset', `-${position}px`);
				this.currentLinePosition = position;
			},
			onComplete: () => {
				if (cb) {
					cb();
				}
			}
		}).play();
	}
	morphToExtended(cb?) {
		const tween = new Tween({
			duration: 1200,
			delay: 0,
			onUpdate: (ep, p, isForward) => {
				let point = animatedLine.points.getItem(this.extendedPoint);
				point.x = (extremeInElasticOutEasing(p) * 50) + 5;
				if (p > 0.6 && this.open === false) {
					this.open = true;
					// this.createBubble();
				}
			},
			onComplete: () => {
				this.setLineLength();
				if (cb) {
					cb();
				}
			}
		}).play();
	}

	morphBack(cb?) {
		const tween = new Tween({
			duration: 1200,
			delay: 0,
			onUpdate: (ep, p, isForward) => {
				let point = animatedLine.points.getItem(this.extendedPoint);
				point.x = (extremeInElasticOutEasing(1 - p) * 50) + 5;

			},
			onComplete: () => {
				let point = animatedLine.points.getItem(this.extendedPoint);
				point.x = 5;
				if (cb) {
					cb();
				}
			}
		}).play();
	}

	createBubble(pointId, cb?) {
		let point = animatedLine.points.getItem(pointId);
		this.defaultBubble = new Shape({
			shape: 'circle',
			top: point.y,
			left: point.x,
			radius: 20,
			origin: `70 20`,
			scale: { 0: 1 },
			onComplete: () => {
				this.defaultBubble.pause();
				if (cb && !this.bubbleCreated) {
					this.bubbleCreated = true;
					cb();
				}
			}
		}).play();
	}
}