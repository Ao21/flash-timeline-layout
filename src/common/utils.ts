export class Helpers {

	static getVectorBetweenPoints(point1, point2) {
		return {
			x: point1.x - point2.x,
			y: point1.y - point2.y

		}
	}

	static addPoints(point1, point2) {
		return {
			x: point1.x + point2.x,
			y: point1.y + point2.y

		}
	}

	static polyLinetoPath(poly) {
		var svgNS = poly.ownerSVGElement.namespaceURI;
		var path = document.createElementNS(svgNS, 'path');
		var points = poly.getAttribute('points').split(/\s+|,/);
		var x0 = points.shift(), y0 = points.shift();
		var pathdata = 'M' + x0 + ',' + y0 + 'L' + points.join(' ');
		if (poly.tagName == 'polygon') pathdata += 'z';
		path.setAttribute('id', poly.getAttribute('id'));
		path.setAttribute('fill', poly.getAttribute('fill'));
		path.setAttribute('stroke', poly.getAttribute('stroke'));
		path.setAttribute('d', pathdata);

		return path;

	}

	static polyLineLength(polylineElement) {
		function dis(p, q) {
			return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
		}
		var ps = polylineElement.points, n = ps.numberOfItems, len = 0;
		for (var i = 1; i < n; i++) {
			len += dis(ps.getItem(i - 1), ps.getItem(i));
		}
		return len;
	}


	static polygonLength(el) {
		console.log(el);
		var points = el.attr('points');
		points = points.split(' ');
		if (points.length > 1) {
			var len = 0;
			if (points.length > 2) {
				for (var i = 0; i < points.length - 1; i++) {
					len += this.dist(this.coord(points[i]), this.coord(points[i + 1]));
				}
			}
			len += this.dist(this.coord(points[0]), this.coord(points[points.length - 1]));
			return len;
		}
		else {
			return 0;
		}
	}

	static dist(c1, c2) {
		if (c1 != undefined && c2 != undefined) {
			return Math.sqrt(Math.pow((c2[0] - c1[0]), 2) + Math.pow((c2[1] - c1[1]), 2));
		} else {
			return 0;
		}
	}

	static coord(c_str) {
		var c = c_str.split(',');
		if (c.length != 2) {
			return; // return undefined
		}
		if (isNaN(c[0]) || isNaN(c[1])) {
			return;
		}
		return [parseFloat(c[0]), parseFloat(c[1])];
	}
}

