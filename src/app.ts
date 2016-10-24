var css = require('./styles/app.scss');
import { TimelineGenerator} from './components/timelineGenerator/timelineGenerator';
import { AnimatedLine } from './components/animatedLine/animatedLine';

export class Main {
	al: AnimatedLine = new AnimatedLine();
	// tl: TimelineGenerator = new TimelineGenerator();
	init() {
		
	}
}


var main = new Main();

document.addEventListener("DOMContentLoaded", function(event) { 
  main.init();
});












