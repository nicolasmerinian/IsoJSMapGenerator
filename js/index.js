var shiftKey = false;
var ctrlKey = false;
var game;
var cl;

(function($) {
	$(window).ready(function() {
	
		cl = new CanvasLoader('canvasloader-container');
		cl.setColor('#1d65a3'); // default is '#000000'
		cl.setDiameter(77); // default is 40
		cl.setDensity(25); // default is 40
		cl.setSpeed(1); // default is 2
		cl.setFPS(40); // default is 24
		
		canvasElement = document.getElementById('canvasElement');
		if (!canvasElement || !canvasElement.getContext) {
			return;
		}
		game = new Game(canvasElement, DATA_INTERVAL);
		
		var body = document.getElementsByTagName('body')[0];
		body.addEventListener('keydown', keyDownHandler, false);
		body.addEventListener('keyup', keyUpHandler, false);
		
		$('#canvasElement').bind("mousewheel DOMMouseScroll", function(event) {
			event.preventDefault();
			if (shiftKey) {
				if (event.originalEvent.wheelDelta >= 0) {
					game.level.zoom = ((game.level.zoom * 10) + 1) / 10;
					if (game.level.zoom > DATA_ZOOM_MAX) {
						game.level.zoom = DATA_ZOOM_MAX;
					}
					game.level.update();
				} else {
					game.level.zoom = ((game.level.zoom * 10) - 1) / 10;
					if (game.level.zoom < DATA_ZOOM_MIN) {
						game.level.zoom = DATA_ZOOM_MIN;
						game.update();
					}
					game.level.update();
				}
			}
		});
		
		$('#canvasElement').on('click', function() {
			game.init(game.level.zoom);
		});
		
		$('#minimap').on('change', function() {
			game.level.minimap = $(this).prop('checked');
			game.level.update();
		});
		
		setMapGeneratorData();

	});
})(jQuery);

function getMinimap() {
	return $('#minimap').prop('checked');
}
function getWater() {
	return $('#water').prop('checked');
}
function getCanvasWidth() {
	var value = Math.max(DATA_CANVAS_WIDTH / 2, parseInt($('#canvasWidth').val()));
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return DATA_CANVAS_WIDTH;
}
function getCanvasHeight() {
	var value = Math.max(DATA_CANVAS_HEIGHT / 2, parseInt($('#canvasHeight').val()));
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return DATA_CANVAS_HEIGHT;
}
function getMapSize() {
	var value = parseInt($('#mapSize').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}
function getSkyAltitude() {
	var value = parseInt($('#skyAltitude').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}
function getTreeNumber() {
	var value = parseInt($('#treeNumber').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}
function getMountainNumber() {
	var value = parseInt($('#mountainNumber').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}
function getMountainMinHeight() {
	var value = parseInt($('#mountainMinHeight').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}
function getMountainMaxHeight() {
	var value = parseInt($('#mountainMaxHeight').val());
	if (typeof value == 'number' && !isNaN(value)) {
		return value;
	}
	return undefined;
}

function setMinimap(value) {
	$('#minimap').prop('checked', value);
}
function setWater(value) {
	$('#water').prop('checked', value);
}
function setCanvasWidth(value) {
	$('#canvasWidth').val(Math.max(DATA_CANVAS_WIDTH / 2, value));
}
function setCanvasHeight(value) {
	$('#canvasHeight').val(Math.max(DATA_CANVAS_HEIGHT / 2, value));
}
function setMapSize(value) {
	$('#mapSize').val(value);
}
function setSkyAltitude(value) {
	$('#skyAltitude').val(value);
}
function setTreeNumber(value) {
	$('#treeNumber').val(value);
}
function setMountainNumber(value) {
	$('#mountainNumber').val(value);
}
function setMountainMinHeight(value) {
	$('#mountainMinHeight').val(value);
}
function setMountainMaxHeight(value) {
	$('#mountainMaxHeight').val(value);
}

function getMapGeneratorData() {
	var data = DATA_MAP_GENERATOR_DATA;
	
	var mapSize = getMapSize();
	var skyAltitude = getSkyAltitude();
	var trees = getTreeNumber();
	var mountainNumber = getMountainNumber();
	var mountainMinHeight = getMountainMinHeight();
	var mountainMaxHeight = getMountainMaxHeight();
	var water = getWater();
	
	if (mountainMaxHeight > skyAltitude) {
		skyAltitude = mountainMaxHeight;
		setSkyAltitude(skyAltitude);
	}
	
	if (mountainMinHeight > mountainMaxHeight) {
		var temp = mountainMinHeight;
		mountainMinHeight = mountainMaxHeight;
		mountainMaxHeight = temp;
		setMountainMinHeight(mountainMinHeight);
		setMountainMaxHeight(mountainMaxHeight);
	}
	
	if (typeof mapSize !== 'undefined') {
		data.rowNbr = mapSize;
		data.colNbr = mapSize;
	}	
	if (typeof skyAltitude !== 'undefined') {
		data.skyAltitude = skyAltitude;
	}	
	if (typeof trees !== 'undefined') {
		data.trees = trees;
	}	
	if (typeof mountainNumber !== 'undefined') {
		data.mountainNbr = mountainNumber;
	}	
	if (typeof mountainMinHeight !== 'undefined') {
		data.mountainMinHeight = mountainMinHeight;
	}
	if (typeof mountainMaxHeight !== 'undefined') {
		data.mountainMaxHeight = mountainMaxHeight;
	}
	if (typeof water !== 'undefined') {
		data.water = water;
	}
	
	return data;
};
function setMapGeneratorData() {
	var data = getMapGeneratorData();
	setMapSize(data.rowNbr);
	setSkyAltitude(data.skyAltitude);
	setTreeNumber(data.trees);
	setMountainNumber(data.mountainNbr);
	setMountainMinHeight(data.mountainMinHeight);
	setMountainMaxHeight(data.mountainMaxHeight);
};
				
function keyDownHandler (event) {
	// aff(event.keyCode);
	switch (event.keyCode) {
		case DATA_KEYBOARD.SHIFT :
			shiftKey = true;
			break;
		case DATA_KEYBOARD.CTRL :
			ctrlKey = true;
			break;
	}				
};
function keyUpHandler (event) {
	// aff(event.keyCode);
	switch (event.keyCode) {
		case DATA_KEYBOARD.SHIFT :
			shiftKey = false;
			break;
		case DATA_KEYBOARD.CTRL :
			ctrlKey = false;
			break;
	}	
};

function setCanvasSize(game, canvasId, width, height) {
	width = width || DATA_CANVAS_WIDTH;
	height = height || DATA_CANVAS_HEIGHT;
	setCanvasWidth(width);
	setCanvasHeight(height);
	var canvas = document.getElementById(canvasId);
	var $container = $('#' + canvasId).parent();
	canvas.width = width;
	canvas.height = height;
	$container.css('width', width + 'px');
	$container.css('height', height + 'px');
	DATA_ORIGIN_X = width / 2 - Math.sqrt(h1 * h1 * 2);
	game.level.update();
}

function displayWait(bool) {
	if (bool) {
		cl.show();
	} else {
		cl.hide();
	}
}

function aff(s) {
	console.info('Test : ' + s);
};













