function aff(s) {
	console.info('Message de test : ' + s);
};

var MapGenerator = function(data) {
	this.draw = data.draw;
	var _canvas = null;
	var _context = null;
	this.context2 = null;
	this.context3 = null;
	this.contexts = [];
	this.rowNbr = data.rowNbr;
	this.colNbr = data.colNbr;
	this.skyAltitude = data.skyAltitude;
	this.virtualGround = data.virtualGround;
	this.trees = data.trees;
	this.mountainNbr = data.mountainNbr;
	this.mountainMinHeight = data.mountainMinHeight;
	this.mountainMaxHeight = data.mountainMaxHeight;
	this.water = data.water;
	
	if (this.draw) {
		_canvas = data.canvas;
		_context = data.canvas.getContext('2d');
		this.context2 = data.canvas2.getContext('2d');
		this.context3 = data.canvas3.getContext('2d');
		this.contexts = [_context, this.context2, this.context3];
	}
	
	
	this.getCanvas = function() {
		return _canvas;
	}
	this.setCanvas = function(canvas) {
		_canvas = canvas;
	}
	this.getContext = function() {
		return _context;
	}
	this.setContext = function(console) {
		_context = context;
	}
	this.getCanvasSize = function() {
		return {
			width: _canvas.width,
			height: _canvas.height
		}
	}
	this.getContextById = function(id) {
		return this.contexts[id];
	}
	
	this.init();
	
};

MapGenerator.prototype = {

	addWater: function(waterDepth) {
		var lowestPoints = this.getLowestPoints();
		var randLowestPointIndex = Utils.randomIntBetween(0, lowestPoints.length - 1);
		var lowestPoint = lowestPoints[randLowestPointIndex];
		// aff(lowestPoint.toString());
		var waterableTiles = [];
		// for (var k = 0; k < waterDepth; k++) {
			// waterableTiles = waterableTiles.concat(this.findWaterableTile(lowestPoint, k, waterableTiles));
			waterableTiles = waterableTiles.concat(this.findWaterableTile(lowestPoint, waterDepth, waterableTiles));
			for (var i = 0; i < waterableTiles.length; i++) {
				var currentTile = waterableTiles[i];
				var x = currentTile[0];
				var y = currentTile[1];
				var a = currentTile[2];
				this.isoMatrix[x][y][a + 0] = DATA_LAYERS.WATER;
			}
		// }
		return waterableTiles;
	},

	findWaterableTile: function(lowestPoint, altitude, waterableTiles) {
		var lpx = lowestPoint[0];
		var lpy = lowestPoint[1];
		var lpa = lowestPoint[2];
		var tile = null;
		
		if (lowestPoint 
				&& lowestPoint[2] === altitude 
				&& this.markersWater[lpx][lpy] === 0) {
			waterableTiles.push(lowestPoint);
			this.markersWater[lpx][lpy] = 1;
			this.matrix[lpx][lpy] += 1;
		}
		
		if (lpx - 1 >= 0 
				&& this.matrix[lpx - 1][lpy] === altitude 
				&& this.markersWater[lpx - 1][lpy] === 0) {
			var current = [lpx - 1, lpy, lpa];
			waterableTiles = this.findWaterableTile(current, altitude, waterableTiles);
		}	
		
		if (lpx + 1 < this.rowNbr 
				&& this.matrix[lpx + 1][lpy] === altitude 
				&& this.markersWater[lpx + 1][lpy] === 0) {
			var current = [lpx + 1, lpy, lpa];
			waterableTiles = this.findWaterableTile(current, altitude, waterableTiles);
		}
		
		if (lpy - 1 >= 0 
				&& this.matrix[lpx][lpy - 1] === altitude 
				&& this.markersWater[lpx][lpy - 1] === 0) {
			var current = [lpx, lpy - 1, lpa];
			waterableTiles = this.findWaterableTile(current, altitude, waterableTiles);
		}		
		
		if (lpy + 1 < this.colNbr 
				&& this.matrix[lpx][lpy + 1] === altitude 
				&& this.markersWater[lpx][lpy + 1] === 0) {
			var current = [lpx, lpy + 1, lpa];
			waterableTiles = this.findWaterableTile(current, altitude, waterableTiles);	
		}
		
		return waterableTiles;
		
	},	
	
	drawMap: function(size) {
		var halfsize = size / 2;
		var k = this.matrix.length;
		var l = 0;
		if (k) {
			l = this.matrix[0].length;
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < l; j++) {
				var cellValue = this.matrix[i][j];
				var ctx = this.getContextById(0);
				switch(cellValue) {
					case 0: ctx.fillStyle = '#000';
							break;
					case 1: ctx.fillStyle = '#00F';
							break;
					case 2: ctx.fillStyle = '#0F0';
							ctx.font = '13px Arial';
							break;
					case 3: ctx.fillStyle = '#F00';
							ctx.font = '14px Arial';
							break;
					case 4: ctx.fillStyle = '#FF0';
							ctx.font = '15px Arial';
							break;
					case 5: ctx.fillStyle = '#FA0';
							ctx.font = '15px Arial';
							break;
					case 6: ctx.fillStyle = '#0FF';
							ctx.font = '15px Arial';
							break;
					case 7: ctx.fillStyle = '#F0F';
							ctx.font = '15px Arial';
							break;
				}
				var x = i * size;
				var y = j * size;
				this.drawTile(ctx, x + halfsize, y + halfsize, cellValue);
			}
		}
	},

	drawMapLayer: function(size) {
		var halfsize = size / 2;
		var k = this.matrixLayer.length;
		var l = 0;
		if (k) {
			l = this.matrixLayer[0].length;
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < l; j++) {
				var cellValue = this.matrixLayer[i][j];
				var x = i * size;
				var y = j * size;
				this.drawTile(this.getContextById(1), x + halfsize, y + halfsize, cellValue);
			}
		}
	},

	drawMapMarkers: function(size) {
		var halfsize = size / 2;
		var k = this.markers.length;
		var l = 0;
		if (k) {
			l = this.markers[0].length;
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < l; j++) {
				var cellValue = this.markers[i][j];
				var x = i * size;
				var y = j * size;
				this.drawTile(this.getContextById(2), x + halfsize, y + halfsize, cellValue);
			}
		}
	},
	
	drawTile: function(context, x, y, cellValue) {
		if (context) {
			context.fillText(cellValue, x, y);
		}
	},

	fillHeightTable2: function(mountains) {
		// aff('grid size: ' + this.rowNbr + ' x ' + this.colNbr);
		// aff('-------------------');
		// Fill the matrix with zeros
		this.matrixLayer = [];
		this.matrix = [];
		this.markers = [];
		this.markersWater = [];
		for (var i = 0; i <= this.colNbr; i++) {
			var subArray1 = [];
			var subArray2 = [];
			var subArray3 = [];
			var subArray4 = [];
			var minValue = 0;
			for (var j = 0; j <= this.rowNbr; j++) {	
				subArray1.push(minValue);
				subArray2.push(minValue);
				subArray3.push(minValue);
				subArray4.push(minValue);
			}
			this.matrixLayer.push(subArray1);
			this.matrix.push(subArray2);
			this.markers.push(subArray3);
			this.markersWater.push(subArray4);
		}
		
		for (var i = 0; i < mountains.length; i++) {
			var source = mountains[i];
			this.matrixLayer[source[0]][source[1]] = source[2];
		}
		
		// Perform algorithm
		for (var i = 0; i < this.rowNbr; i++) {
			for (var j = 0; j < this.colNbr; j++) {
				var value = this.matrixLayer[i][j];
				if (value != 0) {
					for (var e = 1; e < Math.abs(value); e++) {
						var limitX = Math.max(0, i, e) - e;
						var limitX2 = Math.min(this.rowNbr + 1, i + e + 2) - 2;
						var limitY = Math.max(0, j, e) - e;
						var limitY2 = Math.min(this.colNbr + 1, j + e + 2) - 2;
						for (var k = limitX; k <= limitX2; k++) {
							this.matrix[k][limitY] += value - e;
								this.markers[k][limitY] += 1;
							this.matrix[k][limitY2] += value - e;
								this.markers[k][limitY2] += 1;
						}
						for (var l = limitY + 1; l < limitY2; l++) {
							this.matrix[limitX][l] += value - e;
								this.markers[limitX][l] += 1;
							this.matrix[limitX2][l] += value - e;
								this.markers[limitX2][l] += 1;
						}
					}
					this.matrix[i][j] += value;
						this.markers[i][j] += 1;
				}
			}	
		}
		return this.matrix;
	},
	
	getIsoMap: function() {
		var cellSize = 20;
		
		this.randomizeMountainDistribution();
		
		this.matrix = this.fillHeightTable2(this.mountains);
		
		// if (this.draw) {
			// for (var i = 0; i < this.contexts.length; i++) {
				// var ctx = this.getContextById(i);
				// ctx.fillStyle = '#000';
				// ctx.font = '12px Arial';
				// ctx.textAlign = 'center';
				// ctx.textBaseline = 'middle';
			// }
			// this.drawMap(cellSize);
			// this.drawMapLayer(cellSize);
			// this.drawMapMarkers(cellSize);
		// }
		
		this.toIsoJsonMatrix(this.skyAltitude, DATA_SHADERS);
		
		if (this.virtualGround) {
			this.insertVirtualGround(DATA_LAYERS.GRASS);
			// this.insertVirtualGround(DATA_LAYERS.LONG_GRASS);
			// this.insertVirtualGround(DATA_LAYERS.LONG_LONG_GRASS);
			// this.insertVirtualGround(DATA_LAYERS.VIRTUAL);
		}
		
		if (this.water) {
			this.addWater(0);
		}
		
		if (this.trees > 0) {
			this.putSomeTrees(this.trees);
		}
		
		return this.isoMatrix;
	},
	
	getLowestPoint: function() {
		var min = null;
		for (var i = 0; i < this.matrix.length - 1; i++) {
			for (var j = 0; j < this.matrix[0].length - 1; j++) {
				var value = this.matrix[i][j];
				if (min == null || value < min[2]) {
					min = [j, i, value];
				}
			}
		}
		return min;
	},	
	
	getLowestPoints: function() {
		var points = [];
		var min = this.getLowestPoint();
		for (var i = 0; i < this.matrix.length - 1; i++) {
			for (var j = 0; j < this.matrix[0].length - 1; j++) {
				var value = this.matrix[i][j];
				if (value === min[2]) {
					points.push([j, i, value]);
				}
			}
		}
		return points;
	},	
	
	// getLowestPoint: function() {
		// var min = null;
		// for (var i = 0; i < this.isoMatrix.length - 1; i++) {
			// for (var j = 0; j < this.isoMatrix[0].length - 1; j++) {
				// var value = Math.max(0, this.isoMatrix[i][j].indexOf('0'));
				// if (min == null || value < min[2]) {
					// min = [j, i, value];
				// }
			// }
		// }
		// return min;
	// },
	
	init: function() {
		this.matrix = null;
		this.matrixLayer = null;
		this.markers = null;
		this.markersWater = null;
		this.isoMatrix = null;
		this.mountains = [];	
	},
	
	insertVirtualGround: function(groundValue) {
		for (var i = 0; i < this.isoMatrix.length - 1; i++) {
			for (var j = 0; j < this.matrix[0].length - 1; j++) {
				this.isoMatrix[i][j].unshift(groundValue);
			}
		}
	},
	
	putSomeTrees: function(treeNbr) {
		var missed = 0;
		var missMax = 10;
		for (var i = 0; i < treeNbr; i++) {
			var planted = false;
			var last = [];
			while (!planted) {
				var randX = Utils.randomIntBetween(1, this.rowNbr - 2);
				var randY = Utils.randomIntBetween(1, this.colNbr - 2);
				var topTileType = this.isoMatrix[randX][randY][Math.max
				(0, this.isoMatrix[randX][randY].indexOf(0) - 1)];
				
				if (last.length === 0 && last[0] !== randX && last[1] !== randY
						&& topTileType !== DATA_LAYERS.WATER
						&& topTileType !== DATA_LAYERS.DEEP_WATER
						&& topTileType !== DATA_LAYERS.TRUNK
						&& topTileType !== DATA_LAYERS.LEAF
					) {
					var currentAltitude = this.isoMatrix[randX][randY].indexOf(0);
					
					this.isoMatrix[randX][randY][currentAltitude + 0] = DATA_LAYERS.TRUNK;
					this.isoMatrix[randX][randY][currentAltitude + 1] = DATA_LAYERS.TRUNK;
					this.isoMatrix[randX][randY][currentAltitude + 2] = DATA_LAYERS.TRUNK;
					this.isoMatrix[randX][randY][currentAltitude + 3] = DATA_LAYERS.TRUNK;
					this.isoMatrix[randX][randY][currentAltitude + 4] = DATA_LAYERS.TRUNK;
					this.isoMatrix[randX][randY][currentAltitude + 5] = DATA_LAYERS.LEAF;
					
					this.isoMatrix[randX - 1][randY][currentAltitude + 3] = DATA_LAYERS.LEAF;
					this.isoMatrix[randX - 1][randY][currentAltitude + 4] = DATA_LAYERS.LEAF;
					// this.isoMatrix[randX - 1][randY][currentAltitude + 5] = DATA_LAYERS.LEAF;
					
					this.isoMatrix[randX + 1][randY][currentAltitude + 3] = DATA_LAYERS.LEAF;
					this.isoMatrix[randX + 1][randY][currentAltitude + 4] = DATA_LAYERS.LEAF;
					// this.isoMatrix[randX + 1][randY][currentAltitude + 5] = DATA_LAYERS.LEAF;
					
					this.isoMatrix[randX][randY - 1][currentAltitude + 3] = DATA_LAYERS.LEAF;
					this.isoMatrix[randX][randY - 1][currentAltitude + 4] = DATA_LAYERS.LEAF;
					// this.isoMatrix[randX][randY - 1][currentAltitude + 5] = DATA_LAYERS.LEAF;
					
					this.isoMatrix[randX][randY + 1][currentAltitude + 3] = DATA_LAYERS.LEAF;
					this.isoMatrix[randX][randY + 1][currentAltitude + 4] = DATA_LAYERS.LEAF;
					// this.isoMatrix[randX][randY + 1][currentAltitude + 5] = DATA_LAYERS.LEAF;
					
					last = [randX][randY];
					planted = true;
					missed = 0;
				} else {
					missed++;
					if (missed >= missMax) {
						missed = 0;
						planted = true;
					}
				}
			}
		}
	},
	
	randomizeMountainDistribution: function() {
		for (var i = 0; i < this.mountainNbr; i++) {
			var randX = Utils.randomIntBetween(0, this.rowNbr);
			var randY = Utils.randomIntBetween(0, this.colNbr);
			var randAltitude = Utils.randomIntBetween(this.mountainMinHeight, this.mountainMaxHeight);
			this.mountains.push([randX, randY, randAltitude]);
		}
	},
	
	toIsoJsonMatrix: function(maxAltitude, shaders) {
		this.isoMatrix = [];
		var DATA_LAYERS = {
			'VOID': 0,
			'WATER': 1,
			'DEEP_WATER': 2,
			'GRASS': 3,
			'LONG_GRASS': 4,
			'LONG_LONG_GRASS': 5,
			'GROUND': 6,
			'TRUNK': 7,
			'LEAF': 8,
			'ROCK': 9,
			'WOOD': 10,
			'VIRTUAL' : 11,
			'SNOW' : 12,
			'SAND': 13,
			'NONE': 14
		};
		var fieldValue = 9;
		var voidValue = 0;
		for (var i = 0; i < this.matrix.length; i++) {
			var subY = [];
			for (var j = 0; j < this.matrix[0].length; j++) {
				var subZ = [];
				var value = this.matrix[i][j];
				for (var k = 0; k < maxAltitude; k++) {
					if (k < value) {
						if (k === 0) {
							fieldValue = DATA_LAYERS.GRASS;
						} 
						else if (k === 1) {
							fieldValue = DATA_LAYERS.LONG_GRASS;
						}
						else if (k === 2) {
							fieldValue = DATA_LAYERS.LONG_LONG_GRASS;
						}
						else if (k >= 3) {
							fieldValue = DATA_LAYERS.ROCK;
							if (k > 10 && k / value > 0.9) {
								fieldValue = DATA_LAYERS.SNOW;
							}
						}
						else {
							fieldValue = DATA_LAYERS.NONE;
							aff(k + ', ' + value);
						}
						subZ.push(fieldValue);
					}
					else {
						subZ.push(voidValue);
					}
				}
				subY.push(subZ);
			}
			this.isoMatrix.push(subY);
		}
	}
	
	


};



Utils = {

	avg: function() {
		var argsNbr = arguments.length;
		var sum = 0;
		var avg = null;
		for (var i = 0; i < argsNbr; i++) {
			sum += arguments[i];
		}
		avg = sum / argsNbr;
		return avg;
	},
	
	randomIntBetween: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	randomBoolean: function() {
		return Boolean(Math.floor(Math.random() * 2));
	}
	
};








