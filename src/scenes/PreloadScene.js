export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.image('cat', 'assets/cats/basic_cat.png')
    this.load.image('enemy', 'assets/enemies/basic_dog_enemy.png')
    this.load.image('background', 'assets/bg/bg.png')
  }

  create() {
    this.scene.start('GameScene')
  }
}
