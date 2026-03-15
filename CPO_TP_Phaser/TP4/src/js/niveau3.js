// chargement des librairies

export default class niveau3 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }
    preload() { }

    create() {
        this.add.image(400, 300, "img_ciel");
        this.groupe_plateformes = this.physics.add.staticGroup();
        this.groupe_plateformes.create(200, 584, "img_plateforme");
        this.groupe_plateformes.create(600, 584, "img_plateforme");
        // ajout d'un texte distintcif  du niveau
        this.add.text(400, 100, "Vous êtes dans le niveau 3", {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: "22pt"
        });

        this.player = this.physics.add.sprite(100, 450, "img_perso");
        this.player.refreshBody();
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.clavier = this.input.keyboard.createCursorKeys();
        this.clavier.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.physics.add.collider(this.player, this.groupe_plateformes);

        // Initialisation du double saut
        this.nbSauts = 0;
        this.SAUT_MAX = 2;
        this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte3");
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
        if (this.player.body.touching.down) {
            this.nbSauts = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(this.clavier.space) && this.nbSauts < this.SAUT_MAX) {
            this.player.setVelocityY(-330);
            this.nbSauts++;
        }
        if (Phaser.Input.Keyboard.JustDown(this.clavier.enter) == true) {
            if (this.physics.overlap(this.player, this.porte_retour)) {
                this.scene.switch("selection");
            }
        }
    }
}