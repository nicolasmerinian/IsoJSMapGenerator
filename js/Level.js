var Level = function (data) {
	this.game = data.game;
	this.mapData = data.mapData;
	this.fast = data.fast;
	this.minimap = data.minimap;
	this.zoom = data.zoom || 1;
	this.init();
};

Level.prototype.clearGraphics = function() {
	this.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
};

Level.prototype.getContext = function () {
	return this.context;
};

Level.prototype.getCanvasSize = function () {
	return this.canvasSize;
};

Level.prototype.init = function () {
	this.canvasSize = this.game.getCanvasSize();
	this.context = this.game.getContext();
	this.layer = 0;
	this.maxLayer = this.getMaxNumberOfLayers();
	this.row = 0;
	this.col = 0;
	this.i = 0;
};

Level.prototype.update = function () {
	if (this.fast) {
		this.drawFast();
	}
	else {
		var currentRow = this.mapData[this.row];
		if (typeof currentRow !== 'undefined') {
			var w2 = h2 * w / h;
			var ty = this.row * w2;
			var currentCol = currentRow[this.col];
			var value = currentCol;
			var w1 = h1 * w / h;
			var tx = (this.col * w1);
			tx -= this.row * w1/1;
			ty += w1 / 2;
			if (typeof value !== 'undefined') {
				var currentTileLayers = value;
				for (var i in currentTileLayers) {
					var tileX = tx + DATA_ORIGIN_X;
					var tileY = ty - (this.row * h1) - (i * z) + DATA_ORIGIN_Y + (this.col * h1);
					var tileColors = DATA_COLORS[currentTileLayers[i]];
					if (!tileColors || tileColors.length == 0) {
						continue;
					}
					// Minimap
					if (this.minimap) {
						var size = 10;
						this.context.fillStyle = tileColors[1];
						this.context.strokeStyle = tileColors[2];
						this.context.fillRect(this.col* size, this.row * size, size, size);
						this.context.strokeRect(this.col* size, this.row * size, size, size);
						this.draw(this.context, tileX, tileY , h1, h2, z, tileColors);
					}
				}
			}
		}
		this.i += 1;
		this.col += 1;
		if (this.mapData.length > this.row && this.col >= this.mapData[this.row].length) {
			this.col = 0;
			this.row += 1;
		}
		if (this.row >= this.mapData.length) {
			this.game.stop();
		}
	}
};

Level.prototype.drawIsoTile = function(x,  y,  h1 /*largeur1*/,  h2 /*largeur2*/,  z /*hauteur*/,  colors) {
	// ctx.globalAlpha = 0.5;
	var w1 = h1 * w / h;
	var w2 = h2 * w / h;
	var color1 = colors[0];
	var color2 = colors[1];
	var color3 = colors[2];
	
	this.context.strokeStyle = '#000';
	
	this.context.beginPath();
	this.context.moveTo(x, y + h1);
	this.context.lineTo(x + w2, y + h1);
	this.context.lineTo(x + w2, y + h1 + h2 + z);
	this.context.lineTo(x, y + h1 + z);
	this.context.closePath();
	this.context.fillStyle = color2;
	this.context.strokeStyle = color2;
	this.context.fill();
	// this.context.stroke();

	this.context.beginPath();
	this.context.moveTo(x + w2, y + h2);
	this.context.lineTo(x + w2 + w1, y + h2);
	this.context.lineTo(x + w2 + w1, y + h2 + z);
	this.context.lineTo(x + w2, y + h2 + h1 + z);
	this.context.closePath();
	this.context.fillStyle = color3;
	this.context.strokeStyle = color3;
	this.context.fill();
	// this.context.stroke();
	
	this.context.beginPath();
	this.context.moveTo(x, y + h1);
	this.context.lineTo(x + w1, y);
	this.context.lineTo(x + w1 + w2, y + h2);
	this.context.lineTo(x + w2, y + h1 + h2);
	this.context.closePath();
	this.context.fillStyle = color1;
	this.context.strokeStyle = color2;
	this.context.fill();	
	// this.context.stroke();
	
	this.context.fillStyle = '#FF0';
	this.context.font = '20px solid arial';
	// ctx.fillText(i, x + w1 - 10, y + w2 - 10);
}

Level.prototype.getMaxNumberOfLayers = function() {
	var max = 0;
	for (var row in this.mapData) {
		var currentRow = this.mapData[row];
		if (typeof currentRow !== 'undefined') {
			for (var col in currentRow) {
				var currentCol = currentRow[col];
				var value = currentCol;
				if (typeof value !== 'undefined') {
					var currentTileLayersLength = value.length;
					if (currentTileLayersLength > max) {
						max = currentTileLayersLength;
					}
				}
			}
		}
	}
	return max;
};

Level.prototype.drawFast = function() {
	this.clearGraphics();
	for (var row in this.mapData) {
		var currentRow = this.mapData[row];
		if (typeof currentRow !== 'undefined') {
			var w2 = h2 * this.zoom * w / h;
			var ty = row * w2;
			for (var col in currentRow) {
				var currentCol = currentRow[col];
				var value = currentCol;
				var w1 = h1 * this.zoom * w / h;
				var tx = (col * w1);
				tx -= row * w1 / 1;
				ty += w1 / 2;
				if (typeof value !== 'undefined') {
					var currentTileLayers = value;
					for (var i in currentTileLayers) {
						var tileX = tx + DATA_ORIGIN_X;
						var tileY = ty - (row * h1 * this.zoom) - (i * z * this.zoom) + DATA_ORIGIN_Y;
						var tileColors = DATA_COLORS[currentTileLayers[i]];
						if (tileColors.length == 0) {
							continue;
						}
						if (this.minimap) {
							var size = 10;
							this.context.fillStyle = tileColors[1];
							this.context.strokeStyle = tileColors[2];
							this.context.fillRect(col* size, row * size, size, size);
							this.context.strokeRect(col* size, row * size, size, size);
						}
						this.drawIsoTile(tileX, tileY + (z * 1), h1 * this.zoom, h2 * this.zoom, z * this.zoom, tileColors);
					}
				}
			}
		}
	};
};






