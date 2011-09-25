goog.provide('lime.Box2DShape');

goog.require('lime.Plugin'); 

/**
 * @constructor
 * @extends lime.Plugin
 */
lime.Box2DShape = function(node){
    goog.base(this, node); 
   
    node.box2dshape_ = this;
   
    this.bodyProp_ = {};
    this.shapeProp_ = {};
    this.shapes_ = [];
    
    node.getAngularDamping = lime.Box2DShape.getAngularDamping;
    node.setAngularDamping = lime.Box2DShape.setAngularDamping;
    node.setPosition = this.extendFunction(node.setPosition, lime.Box2DShape.setPosition);
    node.wasAddedToTree = this.extendFunction(node.wasAddedToTree, lime.Box2DShape.wasAddedToTree, true);
    node.wasRemovedFromTree = this.extendFunction(node.wasRemovedFromTree, lime.Box2DShape.wasRemovedFromTree, true);
    node.getBox2DBase = lime.Box2DShape.getBox2DBase;
    node.getBody = lime.Box2DShape.getBody;
    node.makeShapes = lime.Box2DShape.makeShapes;
    
};
goog.inherits(lime.Box2DShape, lime.Plugin);


/**
 * @this {lime.Node}
 */
lime.Box2DShape.getBody = function(){
    if (!this.body_) {
        var bodyDef = new box2d.BodyDef;
        var pos = this.getPosition(); //todo: add gradchildren support
        bodyDef.position.Set(pos.x, pos.y);
        bodyDef.rotation = -this.getRotation() / 180 * Math.PI;
        
        if (this.box2dshape_.shapes_.length === 0)
            this.makeShapes();
        
        for(var i=0;i<this.box2dshape_.shapes_;i++){
            bodyDef.AddShape(this.box2dshape_.shapes_[i]);
        }
        
        this.body_ = this.getBox2DBase().node_.getWorld().CreateBody(bodyDef);
    }
    return this.body_;
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.getAngularDamping = function(){
    return node.box2dshape_.bodyProp_.angularDamping
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.setAngularDamping = function(value){
    node.box2dshape_.bodyProp_.angularDamping = value;
    if (this.body_) {
        this.body_.m_angularDamping = box2d.Math.b2Clamp(1.0 - value, 0.0, 1.0);
    }
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.setPosition = function(){
    if(!this.no_physics_update_){
        if(this.body_){
            var p = this.getPosition();
            this.body_.position.Set(p.x, p.y);
        }        
    }
};

/**
 * @this {this.Node}
 */
lime.Box2DShape.setRotation = function(){
    if(!this.no_physics_update_){
        if(this.body_){
            var rotation = this.getRotation();
            this.body_.rotation = -rotation / 180 * Math.PI;
        }
    }
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.wasAddedToTree = function(){
    this.getBox2DBase().shapes_.push(this);
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.wasRemovedFromTree = function(){
    goog.array.remove(this.getBox2DBase().shapes_, this);
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.getBox2DBase = function(){
    var parent = this;
    while (parent) {
        parent = parent.getParent();
        if (parent.box2dBase_) {
            return parent.box2dBase_;
        }
    }
}

/**
 * @this {lime.Node}
 */
lime.Box2DShape.makeShapes = function(){
    this.shapes_ = [];
    if ( this.id === "circle") {
        // circle shape (what to do with ellipses??)
    }
    else if (this.id === "polygon"){
        //polygon shape
    }
    else {
        //box shape
        var shapeDef = new box2d.BoxDef;
        shapeDef.restitution = .9
        shapeDef.density = 0; // static
        shapeDef.friction = 1;
        var size = this.getSize();
        shapeDef.extents.Set(size.width / 2, size.height / 2); //todo: support other anchorpoints
        this.box2dshape_.shapes_.push(shapeDef);
    }
    if(this.body_){
        // todo: reset shape list
    }
}

lime.Node.prototype.makeBox2D = function(){
    this.use(lime.Box2DShape);
    return this;
};