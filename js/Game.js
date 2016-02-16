function Game(canvas, interval) {
	this.canvas = canvas;
	this.interval = interval;
	this.context = canvas.getContext('2d');
	if (!this.context) {
		throw new Error('Game.contructor : context undefined.');
	}
	this.init();
};

Game.prototype.getCanvas = function() {
	return this.canvas;
};

Game.prototype.getContext = function() {
	return this.context;
};

Game.prototype.getCanvasSize = function() {
	return {
		width : this.canvas.width,
		height : this.canvas.height
	};
};

Game.prototype.init = function(zoom) {
	displayWait(true);
	mapGenerator = new MapGenerator(getMapGeneratorData());
	var mapData = mapGenerator.getIsoMap();
	var minimap = getMinimap();
	this.level = new Level({ 
		game: this, 
		mapData: mapData, 
		fast: true, 
		minimap: minimap,
		zoom: zoom
	});
	setCanvasSize(this, this.canvas.id, getCanvasWidth(), getCanvasHeight());
	displayWait(false);
	
	this.lastRender = new Date();
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}());
	
	this.level.update();
};

Game.prototype.run = function() {
	this.stop();
	this.update();
};

Game.prototype.update = function() {
	aff('game.update');
	if (!this.level || !this.level.update) {
		throw new Error('Game.runLevel : undefined level or level\'s update method.');		
	}
	var delta = new Date() - this.lastRender;
	this.level.update();
	
	var self = this;
	window.requestAnimationFrame(function() {
		self.update();
	});
};

Game.prototype.stop = function() {
	clearTimeout(this.timer);
};

Game.prototype.reset = function() {
	this.stop();
	this.init();
};



