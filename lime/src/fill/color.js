goog.provide('lime.fill.Color');

goog.require('goog.color');

goog.require('goog.color.alpha');
goog.require('lime.fill.Fill');

/**
* Color fill
* @param {*} clr Color value.
* @constructor
* @extends lime.fill.Fill
*/
lime.fill.Color = function(clr) {
    lime.fill.Fill.call(this);

    this._hasRGBA = false;

    this.a = 1;

    this.setColor(clr);

};
goog.inherits(lime.fill.Color, lime.fill.Fill);

/**
 * Common name for color objects
 * @type {string}
 */
lime.fill.Color.prototype.id = 'color';

/**
* Gets color as RGBA array.
* @deprecated
* @return {null|Array.<number>} RGBA array.
*/
lime.fill.Color.prototype.getRgba = function() {
    if(goog.DEBUG && console && console.warn) {
        console.warn('color.getRgba() is deprecated.');
    }

    var out = null;

    if (goog.isNumber(this.r) && goog.isNumber(this.g) &&
        goog.isNumber(this.b)) {
        out = [this.r, this.g, this.b, this.a];

    } else if (goog.isString(this.str)) {
        var color = goog.color.parse(this.str);
        if (color.type != 'named') {
            out = goog.color.hexToRgb(color.hex);
        }
        out.push(1);
    }

    return out;
};

lime.fill.Color.prototype.setRGBFromString = function(str) {
    var color = goog.color.parse(str);
    if (color.type != 'named') {
        var rgb = goog.color.hexToRgb(color.hex);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
    }
}

lime.fill.Color.prototype.ensureRGBA = function() {
    if (!this._hasRGBA) {
        this.setRGBFromString();
        this._hasRGBA = true;
    }
    return this;
};

/**
 * Make color lighter
 * @param {number} value Brightness factor.
 * @return {lime.fill.Color} object itself.
 */
lime.fill.Color.prototype.addBrightness = function(value) {
    return this.modifyColor(2, value);
};

/**
 * Modify color value
 * @param {number} mode Settings to change.
 * @param {number} value Amount factor.
 * @return {lime.fill.Color} object itself.
 */
lime.fill.Color.prototype.modifyColor = function(mode, value) {
    var add = value || .1;

    var rgb = this.getRgba();
    if (!rgb) return this;

    rgb.pop();

    var hsl = goog.color.rgbArrayToHsl(rgb);
    hsl[mode] += add;
    if (hsl[mode] > 1) hsl[mode] = 1;

    rgb = goog.color.hslArrayToRgb(hsl);
    rgb.push(this.a);
    return this.setColor(rgb);
};

/**
 * Make color more saturated
 * @param {number} value Saturation factor.
 * @return {lime.fill.Color} ibject itself.
 */
lime.fill.Color.prototype.addSaturation = function(value) {
    return this.modifyColor(1, value);
};

/**
* Set color value of the object. Accepts raw RGB(A) values and strings.
* @param {*} clr New color value.
* @return {lime.fill.Color} object itself.
*/
lime.fill.Color.prototype.setColor = function(clr) {
    var color = clr;

    if (goog.isString(clr)) {
        if (this._hasRGBA) {
            this.setRGBFromString(clr);
        }
        else {
            this.r = this.g = this.b = 1;
        }
        this.str = clr;
        return this;
    }

    this._hasRGBA = true;

    if (arguments.length > 2) {
        color = arguments;
    }
    if (color.length >= 3) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    }
    if (color.length == 4) {
        this.a = color[3];
    }

    this.str = this.a == 1 ?
    'rgb(' + this.r + ',' + this.g + ',' + this.b + ')' :
    'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    return this;
};

/** @inheritDoc */
lime.fill.Color.prototype.setDOMStyle = function(domEl) {
    domEl.style['background'] = this.str;
};

/** @inheritDoc */
lime.fill.Color.prototype.setCanvasStyle = function(context) {
    context.fillStyle = this.str;
};

/**
 * Clone the color
 * @return {lime.fill.Color} New cloned color.
 */
lime.fill.Color.prototype.clone = function() {
    return new lime.fill.Color([this.r, this.g, this.b, this.a]);
};
