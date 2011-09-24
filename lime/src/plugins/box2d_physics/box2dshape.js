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
    
    node.getAngularDamping = lime.Box2DShape.getAngularDamping;
    node.setAngularDamping = lime.Box2DShape.setAngularDamping;
    node.setPosition = this.extendFunction(node.setPosition, lime.Box2DShape.setPosition);
    node.wasAddedToTree = this.extendFunction(node.wasAddedToTree, lime.Box2DShape.wasAddedToTree, true);
    node.wasRemovedFromTree = this.extendFunction(node.wasRemovedFromTree, limeBox2DShape.wasRemovedFromTree, true);
    
};
goog.inherits(lime.Box2DShape, lime.Plugin);


/**
 * @this {lime.Node}
 */
lime.Box2DShape.getBody = function(){
    if (!this.body_) {
        
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
    var parent = this;
    while (parent) {
        parent = parent.getParent();
        if (parent.box2dBase_) {
            return parent.box2dBase_.shapes_.push(this);
        }
    }
};

/**
 * @this {lime.Node}
 */
lime.Box2DShape.wasRemovedFromTree = function(){
    var parent = this;
    while (parent) {
        parent = parent.getParent();
        if (parent.box2dBase_) {
            return goog.array.remove(parent.box2dBase_.shapes_, this);
        }
    }
};

lime.Box2DShape.makeShapes = function(){
    
}
