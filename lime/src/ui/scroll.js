goog.provide('lime.ui.Scroll');

goog.require('lime.Sprite');

/**
 * Object representing Drag interaction.
 * @constructor
 * @extends lime.Sprite
 */
lime.ui.Scroll = function(targetObject) {
    
    goog.base(this);

    //need default size for autoresize
    this.setSize(100, 100);

    this.clipper = new lime.Sprite().setFill('#c00').setSize(100, 100).setAnchorPoint(0,0).setPosition(0,0).
        setAutoResize(lime.AutoResize.ALL);
    this.appendChild(this.clipper);
    this.setMask(this.clipper);

    this.moving_ = new lime.Layer();
    lime.Node.prototype.appendChild.call(this, this.moving_);

    goog.events.listen(this, ['mousedown', 'touchstart'],
        this.downHandler_, false, this);


    var t = this;
    // Initialize Scroller
    this.scroller = new Scroller(function(left, top, zoom) {
        t.moving_.setPosition(-left,-top);
        t.moving_.setScale(zoom);
    }, {
        zooming: true
    });
};
goog.inherits(lime.ui.Scroll, lime.Sprite);


/**
 * @inheritDoc
 * @see lime.Node#appendChild
 */
lime.ui.Scroll.prototype.appendChild = function() {
    if (this.moving_) return this.moving_.appendChild.apply(
        this.moving_, arguments);
    return lime.Node.prototype.appendChild.apply(this, arguments);
};

/**
 * @inheritDoc
 * @see lime.Node#removeChild
 */
lime.ui.Scroll.prototype.removeChild = function() {
    if (this.moving_) return this.moving_.removeChild.apply(
        this.moving_, arguments);
    return lime.Node.prototype.removeChild.apply(this, arguments);
};

lime.ui.Scroll.prototype.handleStart = function(e){
    this.scroller.doTouchStart([{
        pageX : e.position.x,
        pageY : e.position.y 
    }], e.event.getBrowserEvent().timeStamp);
    this.isdown = 1;
};

lime.ui.Scroll.prototype.downHandler_ = function(e) {
    this.scroller.doTouchStart([{
        pageX : e.position.x,
        pageY : e.position.y 
    }], e.event.getBrowserEvent().timeStamp);

    e.swallow(['touchmove', 'mousemove'], this.moveHandler_);

    e.swallow(['touchend', 'mouseup', 'touchcancel'], this.upHandler_);

};

lime.ui.Scroll.prototype.moveHandler_ = function(e) {
    this.scroller.doTouchMove([{
        pageX : e.position.x,
        pageY : e.position.y 
    }], e.event.getBrowserEvent().timeStamp);

};

lime.ui.Scroll.prototype.upHandler_ = function(e) {
    this.scroller.doTouchEnd([{
        pageX : e.position.x,
        pageY : e.position.y 
    }], e.event.getBrowserEvent().timeStamp);

};

lime.ui.Scroll.prototype.update = function(opt_pass) {
    var s1 = this.getSize();
    var s2 = this.moving_.measureContents();
    this.scroller.setDimensions(s1.width, s1.height, s2.right-s2.left, s2.bottom-s2.top);
    return lime.Node.prototype.update.apply(this, arguments);
}

lime.ui.Scroll.prototype.scrollTo = function(){
    //not implemented
}

/**
 * @inheritDoc
 * @see lime.Node#setAnchorPoint
 */
lime.ui.Scroll.prototype.setAnchorPoint = function() {
    if (this.clipper) {
        this.clipper.setAnchorPoint.apply(this.clipper, arguments);
    }
    return lime.Node.prototype.setAnchorPoint.apply(this, arguments);
};
