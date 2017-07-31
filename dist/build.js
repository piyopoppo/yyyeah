(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yyyeah = require("./yyyeah");

var _yyyeah2 = _interopRequireDefault(_yyyeah);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YYYeahInterpreter = function () {
	_createClass(YYYeahInterpreter, null, [{
		key: "exec",
		value: function exec() {
			var self = new YYYeahInterpreter();
		}
	}]);

	function YYYeahInterpreter() {
		_classCallCheck(this, YYYeahInterpreter);

		var output = document.querySelector('#output');
		this.yyyeah = new _yyyeah2.default(output);
		this.bindEvents();
	}

	_createClass(YYYeahInterpreter, [{
		key: "bindEvents",
		value: function bindEvents() {
			var _this = this;

			var source = document.querySelector('#source');
			var convSource = document.querySelector('#conv-source');

			document.querySelector('#exec').addEventListener('click', function () {
				_this.yyyeah.loadSource(source.value);
				_this.yyyeah.interpret();
			});
			document.querySelector('#exec-conv').addEventListener('click', function () {
				source.value = _this.yyyeah.convertFromBrainfuck(convSource.value);
			});
		}
	}]);

	return YYYeahInterpreter;
}();

window.onload = function () {
	YYYeahInterpreter.exec();
};

},{"./yyyeah":2}],2:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function Command() {
	_classCallCheck(this, Command);
};

Command.ADD = 0;
Command.SUB = 1;
Command.NEXT = 2;
Command.PREV = 3;
Command.PRINT = 4;
Command.INPUT = 5;
Command.LOOP = 6;
Command.LOOPEND = 7;

var YYYeah = function () {
	function YYYeah(outputElement) {
		_classCallCheck(this, YYYeah);

		console.log('YYYeah constructor');
		this.outputElement = outputElement;
	}

	_createClass(YYYeah, [{
		key: 'init',
		value: function init() {
			this.cursor = 0;
			this.currentPointer = 0;
			this.pointers = new Array();
			this.pointers[this.currentPointer] = 0;
			this.output = '';
			this.limitCount = 0;
		}
	}, {
		key: 'convertFromBrainfuck',
		value: function convertFromBrainfuck(source) {
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
	}, {
		key: 'loadSource',
		value: function loadSource(sourceText) {
			this.source = sourceText;
			console.log('source text:', this.source);
		}
	}, {
		key: 'interpret',
		value: function interpret() {
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
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.pointers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var data = _step.value;

					this.outputElement.innerHTML += data + ' ';
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.outputElement.innerHTML += ']';
		}
	}, {
		key: 'printStatus',
		value: function printStatus() {
			console.log(this.cursor, '/', this.source.length);
			console.log('current:', this.currentPointer);
			console.log(this.pointers);
		}
	}, {
		key: 'detectCommand',
		value: function detectCommand(cursor) {
			var expression = this.source.substring(cursor, cursor + 12);
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
	}, {
		key: 'executeCommand',
		value: function executeCommand(command) {
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
					var char = String.fromCharCode(this.pointers[this.currentPointer]);
					this.output = this.output + char;
					break;
				case Command.INPUT:
					var userInput = prompt('1バイト入力してください。');
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
	}, {
		key: 'detectLoopEnd',
		value: function detectLoopEnd(cursor) {
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
	}, {
		key: 'detectLoopStart',
		value: function detectLoopStart(cursor) {
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
	}]);

	return YYYeah;
}();

exports.default = YYYeah;

},{}]},{},[1]);
