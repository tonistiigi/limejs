goog.provide('lime.animation.ColorTo');


goog.require('lime.Sprite');
goog.require('lime.animation.Animation');

function ColorProp(from, to) {
    this.start = from;
    this.delta = [
        to.r - from.r,
        to.g - from.g,
        to.b - from.b,
        to.a - from.a
    ];
    this.color = new lime.fill.Color(0, 0, 0);
}

ColorProp.prototype.setT = function(t) {
    this.color.setColor(
        Math.round(this.start.r + this.delta[0] * t),
        Math.round(this.start.g + this.delta[1] * t),
        Math.round(this.start.b + this.delta[2] * t),
        this.start.a + this.delta[3] * t
    );
}

/**
 * Animation for changing element's fillcolor value
 * @param {mixed...} args Color definition.
 * @constructor
 * @extends lime.animation.Animation
 */
lime.animation.ColorTo = function(args) {
    lime.animation.Animation.call(this);

    var color = lime.fill.parse(goog.array.toArray(arguments));
    this.color_ = color.ensureRGBA();
};
goog.inherits(lime.animation.ColorTo, lime.animation.Animation);

/** @inheritDoc */
lime.animation.ColorTo.prototype.scope = 'color';

/** @inheritDoc */
lime.animation.ColorTo.prototype.makeTargetProp = function(target) {
    var fill = target.getFill(),
        oldrgb = fill instanceof lime.fill.Color ? fill.ensureRGBA() :
            new lime.fill.Color(255,255,255,0);
    return new ColorProp(oldrgb, this.color_);
};

/** @inheritDoc */
lime.animation.ColorTo.prototype.update = function(t, target) {
    if (this.status_ == 0) return;

    var prop = this.getTargetProp(target);
    if (prop instanceof ColorProp) {
        prop.setT(t);
        target.setFill(prop.color);
    }
};
