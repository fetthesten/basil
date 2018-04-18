var game_width = 1024;
var game_height = 768;
var canvas = document.getElementById('basil_div');

var globals = 
{
	default_image: 'default_img',
	
	groups: {}
};

var emitter;

var buttonConfig =
{
	buttonSize: 64,
	buttonImg: 'gui_onscreenbuttons',
	buttons:
	{
		'left': { frame: 0, 'keycodes': [Phaser.KeyCode.LEFT, Phaser.KeyCode.A] }, 
		'right': { frame: 1, 'keycodes': [Phaser.KeyCode.RIGHT, Phaser.KeyCode.D] }, 
		'jump': { frame: 2, 'x': 'right', 'keycodes': [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.W, Phaser.KeyCode.Z, Phaser.KeyCode.UP] } 

	}
};

var game = new Phaser.Game(
	game_width,
	game_height,
	Phaser.AUTO,
	canvas,
	{
		preload: preload,
		create: create,
		update: update,
		render: render
	},
	false,
	false
);

function preload()
{
	game.stage.backgroundColor = '#85b5e1';
	game.load.baseURL = 'assets/';
	
	var images = 
	{
		donk: 'donk.png'
	};
	
	var spritesheets = 
	{
		gui_onscreenbuttons: { url: 'gui/onscreenbuttons.png', width: 64, height: 64 }
	};
	
	for (var img in images)
		game.load.image(img, images[img]);
	for (var sheet in spritesheets)
	{
		game.load.spritesheet(sheet, 
			spritesheets[sheet].url, 
			spritesheets[sheet].width,
			spritesheets[sheet].height
			);
	}
	
	
};

function create()
{
	setUpButtons(buttonConfig);
	emitter = game.add.emitter(game.world.centerX, 100, 200);
    emitter.makeParticles('donk');
    emitter.start(false, 5000, 20);
};

function update()
{
	
};

function render()
{
};

function setUpButtons(cfg)
{
	globals.groups.onScreenButtons = game.add.group();
	var buttonCounts = 
	{
		'left': 0,
		'right': 0
	};
	globals.buttons = {};
	var img = cfg.buttonImg;
	var buttonSize = cfg.buttonSize;
    for (var b in cfg.buttons) 
	{
		globals.buttons[b] = {};
		
		var buttonCfg = cfg.buttons[b];
		var button = globals.buttons[b];
		
		var frame = 0;
		if ('frame' in buttonCfg)
			frame = buttonCfg.frame;
		
		button.name = b;
		button.isDown = false;
		button.keys = [];
		for (var kc = 0; kc < buttonCfg.keycodes.length; kc++)
		{
			button.keys.push(game.input.keyboard.addKey(buttonCfg.keycodes[kc]));
			button.keys[kc].onDown.add(function(){this.isDown = true;}, globals.buttons[b]);
			button.keys[kc].onUp.add(function(){this.isDown = false;}, globals.buttons[b]);
		}
		var xAlign = 'left';
		if ('x' in buttonCfg)
			xAlign = buttonCfg.x;
		var yAlign = 'bottom';
		if ('y' in buttonCfg)
			yAlign = buttonCfg.y;
		var xOffset = (buttonCounts[xAlign] * buttonSize) + buttonSize / 2;
		var yOffset = buttonSize / 2;
		buttonCounts[xAlign] += 1;
		if (xAlign === 'right')
			xOffset = game.width - xOffset;
		if (yAlign === 'bottom')
			yOffset = game.height - yOffset;
        button.img = game.add.sprite(xOffset, yOffset, img, frame, globals.groups.onScreenButtons);
        button.img.anchor.set(0.5);
        button.img.inputEnabled = true;
		button.img.events.onInputDown.add(function(){this.isDown = true;}, globals.buttons[b]);
		button.img.events.onInputUp.add(function(){this.isDown = false;}, globals.buttons[b]);
    }
};