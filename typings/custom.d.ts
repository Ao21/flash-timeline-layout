interface NodeSelector {
	querySelector(selectors: string): Element | SVGSVGElement | any;
}

interface Document extends Node, GlobalEventHandlers, NodeSelector, DocumentEvent, ParentNode { }