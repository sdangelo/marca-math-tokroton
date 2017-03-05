/*
 * Copyright (C) 2017 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function (Marca, Kroton) {
	Marca.DOMElementText.toKrotonProto = Kroton.Text;
	Marca.DOMElementText.toKroton = function () {
		var ret = Object.create(this.toKrotonProto);
		ret.italic = this.renderItalic == true;
		ret.bold = this.renderBold == true;
		ret.big = this.renderBig == true;
		ret.value = this.text;
		return ret;
	};

	Marca.DOMElementMath.toKroton = function () {
		var ret = Object.create(this.toKrotonProto);
		ret.id = this.id;
		ret.class = this.class;
		return ret;
	};

	Marca.DOMElementMathRoot.toKrotonProto = Kroton.Expression;
	Marca.DOMElementMathRoot.toKroton = function () {
		var ret = Marca.DOMElementMath.toKroton.call(this);
		ret.definitions = {};
		for (var i = 0; i < this.definitions.length; i++) {
			var d = this.definitions[i];
			ret.definitions[d.id] = d.toKroton(ret.definitions);
		}
		ret.children = [];
		for (var i = 0; i < this.instances.length; i++)
			ret.children.push(this.instances[i]
					      .toKroton(ret.definitions));
		return ret;
	};

	Marca.DOMElementMathElement.toKroton = function () {
		var ret = Marca.DOMElementMath.toKroton.call(this);
		if (this.delimiterLeft !== undefined)
			ret.delimiterLeft = this.delimiterLeft;
		if (this.delimiterRight !== undefined)
			ret.delimiterRight = this.delimiterRight;
		return ret;
	};

	Marca.DOMElementMathSpace.toKrotonProto = Kroton.Space;
	Marca.DOMElementMathSpace.toKroton = function () {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.italic = this.renderItalic == true;
		ret.bold = this.renderBold == true;
		ret.big = this.renderBig == true;
		if (this.size !== undefined)
			ret.size = this.size;
		return ret;
	};

	Marca.DOMElementMathExpression.toKrotonProto = Kroton.Expression;
	Marca.DOMElementMathExpression.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.children = new Array(this.children.length);
		for (var i = 0; i < this.children.length; i++)
			ret.children[i] =
				this.children[i].toKroton(definitions);
		return ret;
	};

	Marca.DOMElementMathScripted.toKrotonProto = Kroton.Script;
	Marca.DOMElementMathScripted.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.main = this.main.toKroton(definitions);
		if (this.topLeft)
			ret.topLeft = this.topLeft.toKroton(definitions);
		if (this.bottomLeft)
			ret.bottomLeft = this.bottomLeft.toKroton(definitions);
		if (this.bottomRight)
			ret.bottomRight =
				this.bottomRight.toKroton(definitions);
		if (this.topRight)
			ret.topRight = this.topRight.toKroton(definitions);
		ret.scaled = this.scaled != false;
		return ret;
	};

	Marca.DOMElementMathStack.toKrotonProto = Kroton.Stack;
	Marca.DOMElementMathStack.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.main = this.main.toKroton(definitions);
		if (this.over)
			ret.over = this.over.toKroton(definitions);
		if (this.under)
			ret.under = this.under.toKroton(definitions);
		ret.scaled = this.scaled != false;
		ret.mainStretched = this.mainStretched == true;
		ret.overStretched = this.overStretched == true;
		ret.underStretched = this.underStretched == true;
		ret.shiftedByYMinMax = this.shifted != false;
		return ret;
	};

	Marca.DOMElementMathNthRoot.toKrotonProto = Kroton.Root;
	Marca.DOMElementMathNthRoot.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.radicand = this.radicand.toKroton(definitions);
		if (this.index)
			ret.index = this.index.toKroton(definitions);
		ret.scaled = this.scaled != false;
		return ret;
	};

	Marca.DOMElementMathGrid.toKrotonProto = Kroton.Grid;
	Marca.DOMElementMathGrid.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.cells = new Array(this.cells.length);
		for (var i = 0; i < this.cells.length; i++) {
			ret.cells[i] = new Array(this.cells[i].length);
			for (var j = 0; j < this.cells[i].length; j++)
				ret.cells[i][j] =
					this.cells[i][j].toKroton(definitions);
		}
		if (this.horizontalLines)
			ret.horizontalLines = this.horizontalLines.slice(0);
		if (this.verticalLines)
			ret.verticalLines = this.verticalLines.slice(0);
		ret.centerAligned = this.align != "l";
		return ret;
	};

	Marca.DOMElementMathMultiline.toKrotonProto = Kroton.Multiline;

	Marca.DOMElementMathDefinition.toKrotonProto = Kroton.Expression;
	Marca.DOMElementMathDefinition.toKroton =
		Marca.DOMElementMathExpression.toKroton;

	Marca.DOMElementMathPlaceholder.toKrotonProto = Kroton.Placeholder;
	Marca.DOMElementMathPlaceholder.toKroton = function (definitions) {
		var ret = Marca.DOMElementMathElementInstance
			       .toKroton.call(this);
		ret.definition = definitions[this["for"]];
		return ret;
	};
};
