goog.provide('lime.Box2DShape');

goog.require('lime.Plugin'); 

/**
 * @constructor
 * @extends lime.Plugin
 */
lime.Box2DShape = function(node, box2d){
   goog.base(this, node); 
   
   this.box2d_ = box2d;
};
goog.inherits(lime.Box2DShape, lime.Plugin);

