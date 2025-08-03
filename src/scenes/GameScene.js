export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    // 📏 맵 전체 크기 정의 (예: 3840px = 3배 너비)
    const mapWidth = 3840
    const mapHeight = 720

    // 🌄 배경 깔기 (반복된 배경 이미지 또는 단일 배경으로 늘리기)
    this.bg = this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(mapWidth, mapHeight)

    // 🎮 월드 경계 설정
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight)

    // 👁️ 카메라 경계 설정
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)

    // 🎹 키보드 좌우 이동
    this.cursors = this.input.keyboard.createCursorKeys()

    // 고양이와 적 초기 위치
    this.cat = this.add.sprite(200, 360, 'cat').setScale(0.4)
    this.enemy = this.add.sprite(mapWidth - 200, 360, 'enemy').setScale(0.4)
  }

  update() {
    // 👉 카메라 좌우 이동
    if (this.cursors.left.isDown) {
      this.cameras.main.scrollX -= 20
    } else if (this.cursors.right.isDown) {
      this.cameras.main.scrollX += 20
    }

    // 🐾 적 이동
    this.enemy.x -= 1

    // 충돌 시 색 변경
    if (Phaser.Math.Distance.Between(this.cat.x, this.cat.y, this.enemy.x, this.enemy.y) < 10) {
      this.enemy.setTintFill(0xff0000)
    }
  }
}
