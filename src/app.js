"use strict";

import YYYeah from "./yyyeah";

class YYYeahInterpreter {
	static exec() {
		let self = new YYYeahInterpreter();
	}
	constructor() {
		let output = document.querySelector('#output');
		this.yyyeah = new YYYeah(output);
		this.bindEvents();
	}
	bindEvents() {
		let source = document.querySelector('#source');
		let convSource = document.querySelector('#conv-source');

		document.querySelector('#exec').addEventListener('click', () => {
			this.yyyeah.loadSource(source.value);
			this.yyyeah.interpret();
		});
		document.querySelector('#exec-conv').addEventListener('click', () => {
			source.value = this.yyyeah.convertFromBrainfuck(convSource.value);
		});
	}
}
window.onload = () => {
	YYYeahInterpreter.exec();
};
