"use strict";
/*
	+: やすみやすみやすみ
	-: やすみやすみyeah
	>: やすみyeahやすみ
	<: やすみyeahyeah
	.: yeahやすみやすみ
	,: yeahやすみyeah
	[: yeahyeahやすみ
	]: yeahyeahyeah
*/
class Command {
	static ADD = 0;
	static SUB = 1;
	static NEXT = 2;
	static PREV = 3;
	static PRINT = 4;
	static INPUT = 5;
	static LOOP = 6;
	static LOOPEND = 7;
}
export default class YYYeah {
	constructor(outputElement) {
		console.log('YYYeah constructor');
		this.outputElement = outputElement;
	}
	init() {
		this.cursor = 0;
		this.currentPointer = 0;
		this.pointers = new Array();
		this.pointers[this.currentPointer] = 0;
		this.output = '';
		this.limitCount = 0;
	}
	convertFromBrainfuck(source) {
		var conv = source;
		conv = conv.replace(/\+/g, 'やすみやすみやすみ');
		conv = conv.replace(/-/g, 'やすみやすみyeah');
		conv = conv.replace(/>/g, 'やすみyeahやすみ');
		conv = conv.replace(/</g, 'やすみyeahyeah');
		conv = conv.replace(/\./g, 'yeahやすみやすみ');
		conv = conv.replace(/,/g, 'yeahやすみyeah');
		conv = conv.replace(/\[/g, 'yeahyeahやすみ');
		conv = conv.replace(/\]/g, 'yeahyeahyeah');
		return conv;
	}
	loadSource(sourceText) {
		this.source = sourceText;
		console.log('source text:', this.source);
	}
	interpret() {
		this.init();

		while (true) {
			if (this.limitCount++ > 100000) {
				console.log('limit!');
				this.printStatus();
				break;
			}
			var command = this.detectCommand(this.cursor);
			if (command == null) {
				console.log('end');
				this.printStatus();
				break;
			} else {
				// console.log("command:", command);
				// console.log('cursor: ', this.cursor);
				if (this.executeCommand(command) == false) {
					this.output = 'やすめなかった！';
					this.printStatus();
					break;
				} else {
					this.outputElement.innerHTML = this.output;
				}
			}
		}
		this.outputElement.innerHTML = this.output;
		// output pointers
		this.outputElement.innerHTML += '<br>';
		this.outputElement.innerHTML += '[ ';
		for (let data of this.pointers) {
			this.outputElement.innerHTML += data + ' ';
		}
		this.outputElement.innerHTML += ']';
	}
	printStatus() {
		console.log(this.cursor, '/', this.source.length);
		console.log('current:', this.currentPointer);
		console.log(this.pointers);
	}
	detectCommand(cursor) {
		let expression = this.source.substring(cursor, cursor + 12);
		if (expression.startsWith('やすみやすみやすみ')) {
			return [Command.ADD, 9];
		} else if (expression.startsWith('やすみやすみyeah')) {
			return [Command.SUB, 10];
		} else if (expression.startsWith('やすみyeahやすみ')) {
			return [Command.NEXT, 10];
		} else if (expression.startsWith('やすみyeahyeah')) {
			return [Command.PREV, 11];
		} else if (expression.startsWith('yeahやすみやすみ')) {
			return [Command.PRINT, 10];
		} else if (expression.startsWith('yeahやすみyeah')) {
			return [Command.INPUT, 11];
		} else if (expression.startsWith('yeahyeahやすみ')) {
			return [Command.LOOP, 11];
		} else if (expression.startsWith('yeahyeahyeah')) {
			return [Command.LOOPEND, 12];
		} else {
			return null;
		}
	}
	executeCommand(command) {
		switch (command[0]) {
			case Command.ADD:
				this.pointers[this.currentPointer]++;
				break;
			case Command.SUB:
				this.pointers[this.currentPointer]--;
				break;
			case Command.NEXT:
				this.currentPointer++;
				if (this.currentPointer >= this.pointers.length) {
					this.pointers.push(0);
				}
				break;
			case Command.PREV:
				this.currentPointer--;
				if (this.currentPointer < 0) {
					// error
					return false;
				}
				break;
			case Command.PRINT:
				let char = String.fromCharCode(this.pointers[this.currentPointer]);
				this.output = this.output + char;
				break;
			case Command.INPUT:
				let userInput = prompt('1バイト入力してください。');
				this.pointers[this.currentPointer] = userInput.charCodeAt(0);
				break;
			case Command.LOOP:
				if (this.pointers[this.currentPointer] == 0) {
					this.cursor = this.detectLoopEnd(this.cursor);
					if (this.cursor == null) {
						// error
						return false;
					}
					return true;
				}
				break;
			case Command.LOOPEND:
				if (this.pointers[this.currentPointer] != 0) {
					this.cursor = this.detectLoopStart(this.cursor);
					if (this.cursor == null) {
						// error
						return false;
					}
					return true;
				}
				break;
			default:
				// error
				return false;
		}
		this.cursor += command[1];
	}
	detectLoopEnd(cursor) {
		var loopCount = 0;
		while (true) {
			var command = this.detectCommand(cursor);
			if (cursor >= this.source.length) {
				return null;
			} else {
				if (command == null) {
					cursor++;
					continue;
				}
				switch (command[0]) {
					case Command.LOOP:
						loopCount++;
						break;
					case Command.LOOPEND:
						if (loopCount == 1) {
							return cursor + command[1];
						} else {
							loopCount--;
						}
						break;
				}
				cursor += command[1];
			}
		}
	}
	detectLoopStart(cursor) {
		var loopCount = 0;
		while (true) {
			var command = this.detectCommand(cursor);
			if (cursor < 0) {
				return null;
			} else {
				if (command == null) {
					cursor--;
					continue;
				}
				switch (command[0]) {
					case Command.LOOPEND:
						loopCount++;
						break;
					case Command.LOOP:
						if (loopCount == 1) {
							return cursor + command[1];
						} else {
							loopCount--;
						}
						break;
				}
				cursor -= 9;
			}
		}
	}
}
