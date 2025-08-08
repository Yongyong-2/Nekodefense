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
    this.container1 = this.add.container(0, 0)
    this.slots = []
    const slotY = screenHeight - 50

    for (let i = 0; i < 3; i++) {
      const slot = this.add.rectangle(160 + i * 180, slotY, 150, 80, 0xffffff)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown', (pointer, localX, localY, event) => {
          this.enterPlacementMode(i)
          event.stopPropagation()
        })

      const label = this.add.text(slot.x - 20, slot.y - 10, `Cat ${i + 1}`, {
        fontSize: '20px',
        color: '#000'
      }).setScrollFactor(0)

      this.container1.add([slot, label])
      this.slots.push(slot)
    }

    this.selectedCatIndex = null

    // 🟩 배치 가능한 셀 정의 (3행 4열 예시)
    this.placementGrid = [
      [ { x: 900, y: 400 }, { x: 600, y: 400 }, { x: 700, y: 400 }, { x: 800, y: 400 } ],
      [ { x: 900, y: 500 }, { x: 600, y: 500 }, { x: 700, y: 500 }, { x: 800, y: 500 } ],
      [ { x: 900, y: 300 }, { x: 600, y: 300 }, { x: 700, y: 300 }, { x: 800, y: 300 } ]
    ]

    // 🟥 셀 시각화용 박스 생성
    this.placementZoneRects = []
    for (let row of this.placementGrid) {
      for (let cell of row) {
        const rect = this.add.rectangle(cell.x, cell.y, 100, 100, 0xffffff, 0.2)
          .setStrokeStyle(2, 0xffffff)
          .setVisible(false)
        this.placementZoneRects.push(rect)
      }
    }

    // 🐾 클릭 시 고양이 배치 (셀 안에서만 가능)
    this.input.on('pointerdown', (pointer) => {
      if (this.selectedCatIndex !== null) {
        const clickX = pointer.worldX
        const clickY = pointer.worldY
        const cellSize = 100
        let placed = false

        for (let row of this.placementGrid) {
          for (let cell of row) {
            if (
              Math.abs(clickX - cell.x) < cellSize / 2 &&
              Math.abs(clickY - cell.y) < cellSize / 2
            ) {
              const cat = this.add.sprite(cell.x, cell.y, 'cat').setScale(0.1)
              this.physics.add.existing(cat)
              this.cats.push(cat)

              this.selectedCatIndex = null
              this.placementZoneRects.forEach(r => r.setVisible(false))
              placed = true
              break
            }
          }
          if (placed) break
        }

        if (!placed) {
          console.log("❌ 배치 불가 영역입니다.")
        }
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
        enemy.body.setSize(50, 50)
        this.enemies.push(enemy)
      }
    })
  }

  enterPlacementMode(index) {
    console.log(`배치 모드: Cat ${index + 1}`)
    this.selectedCatIndex = index
    this.placementZoneRects.forEach(rect => rect.setVisible(true))
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
