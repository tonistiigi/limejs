goog.provide('lime.Box2DShape');

goog.require('lime.Plugin'); 

/**
 * @constructor
 * @extends lime.Plugin
 */
lime.Box2DShape = function(node, box2d){
    goog.base(this, node); 
   
    this.box2d_ = box2d;
    this.bodyProp_ = {};
    this.shapeProp_ = {};
    
    node.getAngularDamping = lime.Box2DShape.getAngularDamping;
    node.setAngularDamping = lime.Box2DShape.setAngularDamping;
    node.setPosition = this.extendFunction(node.setPosition, lime.Box2DShape.setPosition);
    
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
    return this.bodyProp_.angularDamping
}
/**
 * @this {lime.Node}
 */
lime.Box2DShape.setAngularDamping = function(value){
    this.bodyProp_.angularDamping = value;
    if (this.body_) {
        this.m_angularDamping = box2d.Math.b2Clamp(1.0 - this.angularDamping_, 0.0, 1.0);
    }
}

/**
 * @this {lime.Node}
 */
lime.Box2DShape.setPosition = function(){
    if(this.body_){
        var p = this.getPosition();
        this.body_.position.Set(p.x, p.y);
    }
}
