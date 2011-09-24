goog.provide('lime.Plugin');

goog.provide('lime.Node');

/**
* Plugin
* @param {lime.Node} node Node to extend with the plugin.
* @constructor
*/
lime.Plugin = function(node) {
    this.node_ = node;
};

lime.Plugin.prototype.extendFunction = function(oldFunction, newFunction, opt_addToFront){
    var addToFront = !!opt_addToFront;
    
    return function(){
        if (addToFront)
            newFunction.apply(this.node_, arguments);
        
        var result = oldFunction.apply(this.node_, arguments);
        
        if (!addToFront)
            newFunction.apply(this.node_, arguments);
        return result;
    }
};


