class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
    // Rien à charger pour le menu pour le moment
  }

  create() {
    // Fond de couleur
    this.cameras.main.setBackgroundColor('#2d2d44');
    
    // Titre
    this.add.text(400, 150, 'MON JEU', {
      fontSize: '64px',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Bouton de démarrage
    const boutonJouer = this.add.rectangle(400, 350, 200, 60, 0x00aa00);
    boutonJouer.setInteractive();
    boutonJouer.on('pointerover', () => {
      boutonJouer.setFillStyle(0x00ff00);
    });
    boutonJouer.on('pointerout', () => {
      boutonJouer.setFillStyle(0x00aa00);
    });
    
    // Texte du bouton
    this.add.text(400, 350, 'JOUER', {
      fontSize: '32px',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Événement au clic du bouton
    boutonJouer.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }

  update() {
    // Rien à faire dans la boucle update du menu
  }
}
