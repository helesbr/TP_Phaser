/* variables globales accessibles dans toutes les fonctions */
var groupe_plateformes;
var player; // désigne le sprite du joueur
var clavier;
var score = 0;
var gameOver = false;
var nbSauts = 0;
var SAUT_MAX = 2

export default class selection extends Phaser.Scene {
    constructor() {
        super({ key: "selection" });
    }
    /** FONCTION PRELOAD 
  /***********************************************************************/

    /** La fonction preload est appelée une et une seule fois,
     * lors du chargement de la scene dans le jeu.
     * On y trouve surtout le chargement des assets (images, son ..)
     */
    preload() {


        // chargement tuiles de jeu
        this.load.image("Phaser_tuilesdejeu", "src/assets/images/tuilesJeu.png");

        // chargement de la carte
        this.load.tilemapTiledJSON("carte", "src/assets/images/map.tmj");
        this.load.spritesheet("img_perso", "src/assets/images/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('img_porte1', 'src/assets/images/door1.png');
        this.load.image('img_porte2', 'src/assets/images/door2.png');
        this.load.image('img_porte3', 'src/assets/images/door3.png');

    }
    /***********************************************************************/
    /** FONCTION CREATE 
    /***********************************************************************/

    /* La fonction create est appelée lors du lancement de la scene
     * si on relance la scene, elle sera appelée a nouveau
     * on y trouve toutes les instructions permettant de créer la scene
     * placement des peronnages, des sprites, des platesformes, création des animations
     * ainsi que toutes les instructions permettant de planifier des evenements
     */

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

        player = this.physics.add.sprite(100, 450, "img_perso");
        player.setCollideWorldBounds(true);
        player.setBounce(0.2);

        // COLLISION avec les plateformes de la tilemap
        this.physics.add.collider(player, calque_plateforme);

        // CLAVIER
        clavier = this.input.keyboard.createCursorKeys();
        clavier.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
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
        this.cameras.main.startFollow(player);

        this.porte1 = this.physics.add.staticSprite(600, 414, "img_porte1");
        this.porte2 = this.physics.add.staticSprite(50, 264, "img_porte2");
        this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");
    }
    /***********************************************************************/
    /** FONCTION UPDATE 
    /***********************************************************************/

    update() {
        if (gameOver) return;

        // Réinitialisation du compteur de sauts
        if (player.body.onFloor()) {
            nbSauts = 0;
        }

        // Déplacement horizontal
        if (clavier.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('anim_tourne_droite', true);
        }
        else if (clavier.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('anim_tourne_gauche', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('anim_face');
        }

        // Saut / double saut
        if (Phaser.Input.Keyboard.JustDown(clavier.space) && nbSauts < SAUT_MAX) {
            player.setVelocityY(-330);
            nbSauts++;
        }
        if (Phaser.Input.Keyboard.JustDown(clavier.enter) == true) {
            if (this.physics.overlap(player, this.porte1)) this.scene.start("niveau1");
            if (this.physics.overlap(player, this.porte2)) this.scene.start("niveau2");
            if (this.physics.overlap(player, this.porte3)) this.scene.start("niveau3");
        }
    }

}
