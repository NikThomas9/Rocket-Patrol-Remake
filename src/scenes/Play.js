class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //Load sprites
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ship', 'assets/spaceship.png');

        // load explosion spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {

        //Add BG
        this.starfield = this.add.tileSprite(
            0,0,640,480, 'starfield'
        ).setOrigin(0,0);

        //Create player object
        this.p1Rocket = new Rocket(
            this,
            game.config.width/2,
            game.config.height - borderUISize - borderPadding,
            'rocket',
            10
        ).setOrigin(0.5, 0);

        //Create ship objects
        this.ship1 = new Ship(
            this,
            game.config.width + borderUISize*6,
            borderUISize*4,
            'ship',
            0,
            30
        ).setOrigin(0,0);

        this.ship2 = new Ship(
            this,
            game.config.width + borderUISize*3,
            borderUISize*5,
            'ship',
            0,
            20
        ).setOrigin(0,0);

        this.ship3 = new Ship(
            this,
            game.config.width,
            borderUISize*6 + borderPadding*4,
            'ship',
            0,
            10
        ).setOrigin(0,0);

        // green UI background
        this.add.rectangle(
            0,
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00FF00,
            ).setOrigin(0,0);

        // white borders
	    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        //Instantiate input keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);      

        //Animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
    }

    update() {
        //Call update on each object
        this.starfield.tilePositionX -= 4;
        this.p1Rocket.update();
        this.ship1.update();
        this.ship2.update();
        this.ship3.update();

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship3)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);       
        }
        if (this.checkCollision(this.p1Rocket, this.ship2)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);       
        }
        if (this.checkCollision(this.p1Rocket, this.ship1)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);       
        }
    }

    checkCollision(rocket, ship)
    {
        //Check box collision of rocket and ship
        if  (rocket.x > ship.x &&
            rocket.x < ship.x + ship.width &&
            rocket.y > ship.y &&
            rocket.y < ship.y + ship.height)
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    shipExplode(ship) {
        //Hide ship
        ship.alpha = 0;

        //Create explosion animation on ship's location
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       
      }
}