class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // chargement tuiles de jeu
    this.load.image("Phaser_tuilesdejeu", "src/assets/images/tuilesJeu.png");

    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/images/map.tmj");
    this.load.spritesheet("img_perso", "src/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image("bullet", "src/assets/images/balle.png");
    this.load.image("cible", "src/assets/images/cible.png");
    this.load.audio("jump", "src/assets/sons/jump.mp3");
    this.load.audio("jeu", "src/assets/sons/jeu.mp3");
    this.load.audio("tir", "src/assets/sons/tir.mp3");
    this.load.audio("cible", "src/assets/sons/cible.mp3");
  }

  create() {
    // Initialiser les propriétés
    this.score = 0;
    this.gameOver = false;
    this.nbSauts = 0;
    this.SAUT_MAX = 2;
    this.jeu = this.sound.add("jeu");
    this.jump = this.sound.add("jump");
    this.tir = this.sound.add("tir");
    this.cible = this.sound.add("cible");

    this.jeu.play({ loop: true });

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

    // Créer le joueur
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.direction = 'right';

    // COLLISION avec les plateformes de la tilemap
    this.physics.add.collider(this.player, calque_plateforme);

    // CLAVIER
    this.clavier = this.input.keyboard.createCursorKeys();
    this.boutonFeu = this.input.keyboard.addKey('A');

    // Créer les animations
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

    // Créer les groupes
    this.groupeBullets = this.physics.add.group();

    this.cibles = this.physics.add.group({
      key: 'cible',
      repeat: 7,
      setXY: { x: 24, y: 0, stepX: 107 }
    });

    this.cibles.children.iterate((cibleTrouvee) => {
      // définition de points de vie
      cibleTrouvee.pointsVie = Phaser.Math.Between(1, 5);
      // modification de la position en y
      cibleTrouvee.y = Phaser.Math.Between(10, 250);
      // modification du coefficient de rebond
      cibleTrouvee.setBounce(0.8);
      cibleTrouvee.setCollideWorldBounds(true);
    });

    this.physics.add.collider(this.cibles, calque_plateforme);
    this.physics.add.overlap(this.groupeBullets, this.cibles, this.hit, null, this);

    this.physics.world.on("worldbounds", (body) => {
      // on récupère l'objet surveillé
      const objet = body.gameObject;
      // s'il s'agit d'une balle
      if (this.groupeBullets.contains(objet)) {
        // on le détruit
        objet.destroy();
      }
    });

    this.zone_texte_score = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
    this.zone_texte_score.setScrollFactor(0);
  }

  update() {
    if (this.gameOver) return;

    // Réinitialisation du compteur de sauts
    if (this.player.body.onFloor()) {
      this.nbSauts = 0;
    }

    // Déplacement horizontal
    if (this.clavier.right.isDown) {
      this.player.direction = 'right';
      this.player.setVelocityX(200);
      this.player.anims.play('anim_tourne_droite', true);
    }
    else if (this.clavier.left.isDown) {
      this.player.direction = 'left';
      this.player.setVelocityX(-200);
      this.player.anims.play('anim_tourne_gauche', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('anim_face');
    }

    // Saut / double saut
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) && this.nbSauts < this.SAUT_MAX) {
      this.player.setVelocityY(-330);
      this.jump.isPlaying
      this.jump.play();
      this.nbSauts++;
    }


    if (Phaser.Input.Keyboard.JustDown(this.boutonFeu)) {
      this.tirer();
      this.tir.play();
    }
  }

  tirer() {
    const coefDir = this.player.direction === 'left' ? -1 : 1;
    const bullet = this.groupeBullets.create(this.player.x + (25 * coefDir), this.player.y - 4, 'bullet');
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.body.allowGravity = false;
    bullet.setVelocity(1000 * coefDir, 0);
  }

  hit(bullet, cible) {
    cible.pointsVie--;
    if (cible.pointsVie === 0) {
      cible.destroy();
      this.score += 10;
      this.zone_texte_score.setText("Score: " + this.score);
      this.cible.play();
    }
    bullet.destroy();
  }
}
