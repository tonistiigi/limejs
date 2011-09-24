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

lime.Plugin.prototype.extendFunction = function(oldFunction, newFunction){
    var f = function(){
        var result = oldFunction.apply(this.node_, arguments);
        newFunction.apply(this.node_, arguments);
        return result;
    }
    
    for (i in this.node_) {
        if (this.node_[i] == oldFunction){
            this.node_[i] = f;
        }
    }
};


