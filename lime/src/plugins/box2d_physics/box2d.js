goog.provide('lime.Box2D');

goog.require('lime.Plugin');
goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.World');

/**
 * Box2D base plugin
 * @constructor
 * @extends lime.Plugin
 */
lime.Box2D = function(node){
    goog.base(this, node);
    
    this.shapes_ = [];
    node.box2dBase_ = this;
    
    node.getGravity = lime.Box2D.getGravity;
    node.setGravity = lime.Box2D.setGravity;
    node.getWorldBounds = lime.Box2D.getWorldBounds;
    node.setWorldBounds = lime.Box2D.setWorldBounds;
    node.getWorld = lime.Box2D.getWorld;
    
    node.setGravity(0, 0);
    node.setBounds(-1500, 2000, 1500, -2000); // way to define in some other way?
    
    lime.scheduleManager.schedule(this.updatePositions, this);
    
}
goog.inherits(lime.Box2D, lime.Plugin);

/** @const @type {number} */
lime.Box2D.RATIO = 30;

lime.Box2D.prototype.updatePositions = function(dt){
    if (dt>100) dt=100; // long delays(after pause) cause false collisions (maybe should be in scheduleManger instead)
    this.node_.getWorld().Step(dt / 1000, 3);
    
    for (var i=0 ; i < this.shapes_.length ; i++) {
        var shape = this.shapes_[i];
        var body = shape.getBody();
        var position = goog.math.Coordinate.prototype.clone.call(body.GetCenterPosition());
        if (position.getParent() != this.node_ ) {
            position = this.node_.localToNode(this.getParent());
        }
        shape.no_physics_update_ = 1;
        shape.setRotation(-body.GetRotation / Math.PI * 180);
        shape.setPosition(position);
        shape.no_physics_update_ = 0;
    }
    
}

lime.Box

/**
 * @this {lime.Node}
 * @return {box2d.World}
 */
lime.Box2D.getWorld = function(){
    if (!this.world_) {
        var gravity = this.getGravity();
        var bounds = this.getWorldBounds();
        var boundsAABB = new box2d.AABB();
        boundsAABB.minVertex.Set(bounds.left / lime.Box2D.RATIO, bounds.top / lime.Box2D.RATIO);
        boundsAABB.maxVertex.Set(bounds.right / lime.Box2D.RATIO, bounds.bottom / lime.Box2D.RATIO);
        this.world_ = new box2d.World(boundsAABB, new box2d.Vec2(gravity.x, gravity.y), true);
    }
    return this.world_;
}

/**
 * @this {lime.Node}
 * @return {goog.math.Vec2} scale vector.
 */
lime.Box2D.getGravity = function(){
    return this.gravity_;
}
/**
 * @this {lime.Node}
 * @param {(goog.math.Vec2|number)} value New scale vector.
 * @param {number=} opt_y Optionally set scale using x,y.
 * @return {lime.Node} node itself.
 */
lime.Box2D.setGravity = function(){
    if (arguments.length === 1 && goog.isNumber(value)) {
        this.gravity_ = new goog.math.Vec2(value, value);
    }
    else if (arguments.length === 2) {
        this.gravity_ = new goog.math.Vec2(arguments[0], arguments[1]);
    }
    else {
        this.gravity_ = value;
    }
    if (this.world_) {
        this.world_.m_gravity = new box2d.Vec2(this.gravity_.x, this.gravity_.y);
    }
    return this;
};

/**
 * @this {lime.Node}
 * @return {goog.math.Box} Box2d world bounds box.
 */
lime.Box2D.getWorldBounds = function(){
    return this.worldBounds_;
};

/**
 * Set bounds for Box2D space. This can't be overriden once set.
 * @this {lime.Node}
 * @param {goog.Math.box|number} value New box.
 * @param {number=} opt_right Optionally set box using edge locations.
 * @param {number=} opt_bottom Optionally set box using edge locations.
 * @param {number=} opt_left Optionally set box using edge locations. 
 * @return {lime.Node} node itself.
 */
lime.Box2D.setWorldBounds = function(value, opt_right, opt_bottom, opt_left){
    if (arguments.length === 4){
        value = new goog.math.Box(value, opt_right, opt_bottom, opt_left);
    }
    this.worldBounds_ = value;
    return this;
};