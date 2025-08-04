export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    const screenWidth = this.scale.width
    const screenHeight = this.scale.height
    const mapWidth = 3840
    const mapHeight = 720

    // 🎨 배경 이미지 전체 맵에 맞게 출력
    this.bg = this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(mapWidth, mapHeight)

    // 🌍 월드 & 카메라 설정
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cursors = this.input.keyboard.createCursorKeys()

    // 🐱 고양이와 👾 적 유닛 관리용 배열
    this.cats = []
    this.enemies = []

    // 📌 UI 슬롯 하단 고정
    this.ui = this.add.container(0, 0)
    this.slots = []
    const slotY = screenHeight - 50

    for (let i = 0; i < 3; i++) {
      const slot = this.add.rectangle(160 + i * 180, slotY, 150, 80, 0xffffff)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown', (pointer, localX, localY, event) => {
          this.enterPlacementMode(i)
          event.stopPropagation() // 이벤트 전파 중단
        })
        

      const label = this.add.text(slot.x - 20, slot.y - 10, `Cat ${i + 1}`, {
        fontSize: '20px',
        color: '#000'
      }).setScrollFactor(0)

      this.ui.add([slot, label])
      this.slots.push(slot)
    }

    this.selectedCatIndex = null

    // 🐾 화면 클릭 → 고양이 배치
    this.input.on('pointerdown', (pointer) => {
      if (this.selectedCatIndex !== null) {
        const worldX = pointer.worldX
        const worldY = pointer.worldY

        const cat = this.add.sprite(worldX, worldY, 'cat').setScale(0.1)
        this.physics.add.existing(cat)
        this.cats.push(cat)

        this.selectedCatIndex = null
      }
    })

    // 👾 적 자동 생성
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        const enemy = this.add.sprite(mapWidth - 100, 360, 'enemy').setScale(0.1)
        this.physics.add.existing(enemy)
        enemy.body.setVelocityX(-50)
        this.enemies.push(enemy)
      }
    })
  }

  enterPlacementMode(index) {
    console.log(`배치 모드: Cat ${index + 1}`)
    this.selectedCatIndex = index
  }

  update() {
    // 🎮 카메라 좌우 이동
    if (this.cursors.left.isDown) {
      this.cameras.main.scrollX -= 10
    } else if (this.cursors.right.isDown) {
      this.cameras.main.scrollX += 10
    }

    // 👾 왼쪽 끝에 도착한 적 제거
    this.enemies.forEach((enemy, i) => {
      if (enemy.x < 0) {
        enemy.destroy()
        this.enemies.splice(i, 1)
      }
    })
  }
}

