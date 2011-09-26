goog.provide('test.box2d_plugin1');

goog.require('lime');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.Box2D');

test.WIDTH = 600;
test.HEIGHT = 400;


test.start = function() {

    /*

    There is no box2d integration in LimeJS yet. This file only
    shows that box2d is in correct path.

    */

	//director
	test.director = new lime.Director(document.body, test.WIDTH, test.HEIGHT);
	test.director.makeMobileWebAppCapable();

	var gamescene = new lime.Scene();

	var layer = (new lime.Layer).setPosition(100, 0).makeBox2DWorld().setGravity(0,100);
	gamescene.appendChild(layer);

    var box = new lime.Sprite().setFill('#c00').setSize(150,30).setPosition(200,200).makeBox2D();
    layer.appendChild(box);


	// set active scene
	test.director.replaceScene(gamescene);
};

goog.exportSymbol('test.start', test.start);
