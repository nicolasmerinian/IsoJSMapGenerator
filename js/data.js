var DATA_INTERVAL = 1000 / 60;

var DATA_CANVAS_WIDTH = 640;
var DATA_CANVAS_HEIGHT = 480;

var w = 2;
var h = 1;
var h1 = 12;
var h2 = h1;
var z = h1 * 1.5;

var DATA_MAP_GENERATOR_DATA = {
	draw: false, 
	canvas: this.canvas, 
	rowNbr: 15, 
	colNbr: 15,
	skyAltitude: 20,
	virtualGround: true,
	trees: 3,
	mountainNbr: 30,
	mountainMinHeight: 1,
	mountainMaxHeight: 3,
	water: true
};

var DATA_ORIGIN_X = 1000 / 2 - Math.sqrt(h1 * h1 * 2);
var DATA_ORIGIN_Y = -(2 * DATA_MAP_GENERATOR_DATA.mountainMaxHeight) + (10 * z);
var DATA_ZOOM_MIN = 0.1;
var DATA_ZOOM_MAX = 5;

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

var DATA_SHADERS = {
	shaders: {
		ROCK: {
			DOWN: [0, 3, 9],
			UP: [3, 100, 12]
		}
	}
};

var DATA_COLORS = [
	[], //0 nothing
	['#64E8F9', '#32B6C8', '#0F8594'], //1 water
	['#64B0FB', '#327DC8', '#0F5294'], //2 deep water
	['#44E146', '#0E8D10', '#004D01'], //3 grass
	['#36B338', '#0D800F', '#004D01'], //4 long grass
	['#2A8D2C', '#1F6620', '#134014'], //5 very long grass
	['#D2AC65', '#886D3A', '#523E18'], //6 ground
	['#C0A94F', '#806D28', '#40350D'], //7 tree trunc
	['#83E144', '#5BAE23', '#397B0C'], //8 tree leaves
	['#C6C6C6', '#948D94', '#484148'], //9 rock
	['#C0A94F', '#806D28', '#40350D'], //10 wood
	['#E6E6E6', '#999999', '#525252'], //11 virtual
	['#EDF5F7', '#C3D2D6', '#A3B4B8'], //12 snow
	['#F5E693', '#C9BD77', '#8F8449'], //13 sand
	['#454545', '#212121', '#000000'] //14 none
];

var DATA_KEYBOARD = {
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	
	a: 97,
	b: 98,
	c: 99,
	d: 100,
	e: 101,
	f: 102,
	g: 103,
	h: 104,
	i: 105,
	j: 106,
	k: 107,
	l: 108,
	m: 109,
	n: 110,
	o: 111,
	p: 112,
	q: 113,
	r: 114,
	s: 115,
	t: 116,
	u: 117,
	v: 118,
	w: 119,
	x: 120,
	y: 121,
	z: 122,
	
	SPACE: 32,
	ENTER: 13,
	DELETE: 8,
	ESCAPE: 27,
	PN0: 96,
	PN1: 97,
	PN2: 98,
	PN3: 99,
	PN4: 100,
	PN5: 101,
	PN6: 102,
	PN7: 103,
	PN8: 104,
	PN9: 105,
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	SHIFT: 16,
	CTRL: 17
	
};

