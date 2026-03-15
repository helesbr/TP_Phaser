// chargement des librairies

export default class niveau2 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }
    preload() {
        // chargement tuiles de jeu
        this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");
        // chargement de la carte
        this.load.tilemapTiledJSON("carte", "src/assets/map.tmj");
        this.load.spritesheet("img_perso", "src/assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('img_porte1', 'src/assets/door1.png');
        this.load.image('img_porte2', 'src/assets/door2.png');
        this.load.image('img_porte3', 'src/assets/door3.png');
    }

    create() {
        const carteDuNiveau = this.add.tilemap("carte");
        const tileset = carteDuNiveau.addTilesetImage(
            "tuiles_de_jeu",
            "Phaser_tuilesdejeu"
        );
        const calque_fond_noir = carteDuNiveau.createLayer(
            "Calque fond noir",
            tileset
        );
        const calque_eau = carteDuNiveau.createLayer(
            "Calque de eau",
            tileset
        );
        const calque_contours = carteDuNiveau.createLayer(
            "Calque de contours",
            tileset
        );
        const calque_plateforme = carteDuNiveau.createLayer(
            "Calque plateforme",
            tileset
        );
        calque_plateforme.setCollisionByProperty({ estSolide: true });

        // ajout d'un texte distinctif du niveau
        this.add.text(400, 100, "Vous êtes dans le niveau 2", {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: "22pt"
        });

        this.player = this.physics.add.sprite(100, 450, "img_perso");
        this.player.refreshBody();
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // COLLISION avec les plateformes de la tilemap
        this.physics.add.collider(this.player, calque_plateforme);

        // CLAVIER
        this.clavier = this.input.keyboard.createCursorKeys();
        this.clavier.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        // animations
        this.anims.create({
            key: "anim_tourne_gauche",
            frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "anim_tourne_droite",
            frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "anim_face",
            frames: [{ key: "img_perso", frame: 4 }],
            frameRate: 20
        });

        this.physics.world.setBounds(0, 0, carteDuNiveau.widthInPixels, carteDuNiveau.heightInPixels);
        this.cameras.main.setBounds(0, 0, carteDuNiveau.widthInPixels, carteDuNiveau.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // Initialisation du double saut
        this.nbSauts = 0;
        this.SAUT_MAX = 2;
        this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte2");
    }

    update() {
        if (this.clavier.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("anim_tourne_gauche", true);
        } else if (this.clavier.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("anim_tourne_droite", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("anim_face");
        }
        // Saut / double saut
        if (this.player.body.onFloor()) {
            this.nbSauts = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(this.clavier.space) && this.nbSauts < this.SAUT_MAX) {
            this.player.setVelocityY(-330);
            this.nbSauts++;
        }
        if (Phaser.Input.Keyboard.JustDown(this.clavier.enter) == true) {
            if (this.physics.overlap(this.player, this.porte_retour)) {
                this.scene.start("selection");
            }
        }
    }
}