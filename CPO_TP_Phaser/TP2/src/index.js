// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: {
    // une scene est un écran de jeu. Pour fonctionner il lui faut 3 fonctions  : create, preload, update
    preload: preload, // la phase preload est associée à la fonction preload, du meme nom (on aurait pu avoir un autre nom)
    create: create, // la phase create est associée à la fonction create, du meme nom (on aurait pu avoir un autre nom)
    update: update // la phase update est associée à la fonction update, du meme nom (on aurait pu avoir un autre nom)
  }
};

// création et lancement du jeu
new Phaser.Game(config);


/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

/** La fonction preload est appelée une et une seule fois,
 * lors du chargement de la scene dans le jeu.
 * On y trouve surtout le chargement des assets (images, son ..)
 */
function preload() {
  
  
  // chargement tuiles de jeu
this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");

// chargement de la carte
this.load.tilemapTiledJSON("carte", "src/assets/map.tmj"); 
this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  }); 
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

  function create() {

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
}

/***********************************************************************/
/** FONCTION UPDATE 
/***********************************************************************/

function update() {
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
}

var groupe_plateformes;
var player; // désigne le sprite du joueur
var clavier;

var score = 0;

var gameOver = false;
  

var nbSauts = 0;
var SAUT_MAX = 2; 