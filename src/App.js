import React, {
  Component
} from 'react';
import './App.css';
let dungeon = {
  x: 420,
  y: 100,
  w: 1000,
  h: 1000
};
let healthItems = [];
let enemies = [];
let boss = {};
let weapon = {};
let health = 30;
let experience = 0;
let attacks = 10;
let myWeapon = 'stick';
let level = 0;
let num = 0;
let play = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.move = this
      .move
      .bind(this);
    this.state = {
      myDungeon: this.getMyDungeon(),
      playerX: 470,
      playerY: 150,
      health: health,
      myWeapon: myWeapon,
      attacks: attacks,
      level: level,
      experience: experience,
      dungeon: num,
      message: "",
      width: 200,
      height: 200,
      damage: this.getDamages()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.move, false);
    this.generateDungeon();
    this.drawPlayer();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.num !== nextProps.num) {
      this.setState({
        myDungeon: this.getMyDungeon(),
        dungeon: nextProps.num
      });
      this.generateDungeon();
      this.drawPlayer();
    }
  }
  componentDidUpdate() {
    this.generateDungeon();
    this.drawPlayer();
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.move, false);
  }

  splitDungeon(dungeon) {
    let dungeons = [];
    const dungeonA = {};
    const dungeonB = {};
    if (dungeon.w > dungeon.h) {
      const randomW = dungeon.w * this.getRandom();
      dungeonA.x = dungeon.x;
      dungeonA.y = dungeon.y;
      dungeonA.w = randomW;
      dungeonA.h = dungeon.h;
      dungeonB.x = dungeon.x + randomW;
      dungeonB.y = dungeon.y;
      dungeonB.w = dungeon.w - randomW;
      dungeonB.h = dungeon.h;
      dungeons.push(dungeonA);
      dungeons.push(dungeonB);
    } else {
      const randomH = dungeon.h * this.getRandom();
      dungeonA.x = dungeon.x;
      dungeonA.y = dungeon.y;
      dungeonA.w = dungeon.w;
      dungeonA.h = randomH;
      dungeonB.x = dungeon.x;
      dungeonB.y = dungeon.y + randomH;
      dungeonB.w = dungeon.w;
      dungeonB.h = dungeon.h - randomH;
      dungeons.push(dungeonA);
      dungeons.push(dungeonB);
    }
    return dungeons;
  }

  getMyDungeon() {
    //generate a dungeon using a BSP tree
    let rooms = [];
    let corridors = [];
    let myDungeon = [];
    const leaf1 = this.splitDungeon(dungeon);
    const leaf2 = [];
    const leaf3 = [];
    const leaf4 = [];
    for (let i = 0; i < leaf1.length; i++) {
      const items = this.splitDungeon(leaf1[i]);
      leaf2.push(items[0]);
      leaf2.push(items[1]);
    }
    for (let i = 0; i < leaf2.length; i++) {
      const items = this.splitDungeon(leaf2[i]);
      leaf3.push(items[0]);
      leaf3.push(items[1]);
    }
    for (let i = 0; i < leaf3.length; i++) {
      const items = this.splitDungeon(leaf3[i]);
      leaf4.push(items[0]);
      leaf4.push(items[1]);
    }
    // build the rooms
    for (let i = 0; i < leaf4.length; i++) {
      let room = {};
      room.x = this.getRandomInt(leaf4[i].x, leaf4[i].x + 43);
      room.y = this.getRandomInt(leaf4[i].y, leaf4[i].y + 43);
      room.w = this.getRandomInt(100, leaf4[i].w - 43);
      room.h = this.getRandomInt(100, leaf4[i].h - 43);
      rooms.push(room);
    }
    //build corridors on 4th leaf level
    for (let i = 0; i < rooms.length; i += 2) {
      let corridor = {};
      if (leaf4[i].h === leaf4[i + 1].h) {
        corridor = this.getCorridorH(rooms[i], rooms[i + 1]);
      } else if (leaf4[i].w === leaf4[i + 1].w) {
        corridor = this.getCorridorV(rooms[i], rooms[i + 1]);
      }
      corridors.push(corridor);
    }
    //build corridors on 3rd leaf level
    for (let i = 0; i < leaf3.length; i += 2) {
      let corridor = {};
      if (leaf3[i].h === leaf3[i + 1].h) {
        corridor = this.getCorridorH(rooms[2 * i], rooms[2 * (i + 1)]);
      } else if (leaf3[i].w === leaf3[i + 1].w) {
        corridor = this.getCorridorV(rooms[2 * i], rooms[2 * (i + 1)]);
      }
      console.log(corridor);
      corridors.push(corridor);
    }
    //build corridors on 2nd leaf level
    let corridor21 = {};
    if (leaf4[0].h === leaf4[1].h) {
      corridor21 = this.getCorridorH(rooms[1], rooms[4]);
    } else {
      corridor21 = this.getCorridorH(rooms[2], rooms[4]);
    }
    corridors.push(corridor21);
    let corridor22 = {};
    if (leaf4[8].h === leaf4[9].h) {
      corridor22 = this.getCorridorH(rooms[9], rooms[12]);
    } else {
      corridor22 = this.getCorridorH(rooms[10], rooms[12]);
    }
    corridors.push(corridor22);
    //build corridors on first leaf level
    let corridor31 = {};
    if (Math.floor(Math.random() * 2) === 0) {
      if (leaf4[12].h === leaf4[13].h) {
        corridor31 = this.getCorridorV(rooms[7], rooms[13]);
        if (corridor31.x < rooms[7].x || corridor31.x < rooms[13].x || corridor31.x > rooms[7].x + rooms[7].w - 15) {
          if (leaf4[8].h = leaf4[9].h) {
            corridor31 = this.getCorridorV(rooms[3], rooms[9]);
          } else {
            corridor31 = this.getCorridorV(rooms[3], rooms[10]);
          }
        }
      } else {
        corridor31 = this.getCorridorV(rooms[7], rooms[14]);
        if (corridor31.x < rooms[7].x || corridor31.x < rooms[14].x || corridor31.x > rooms[7].x + rooms[7].w - 15) {
          if (leaf4[8].h = leaf4[9].h) {
            corridor31 = this.getCorridorV(rooms[3], rooms[9]);
          } else {
            corridor31 = this.getCorridorV(rooms[3], rooms[10]);
          }
        }
      }
    } else {
      if (leaf4[8].h === leaf4[9].h) {
        corridor31 = this.getCorridorV(rooms[3], rooms[9]);
        if (corridor31.x < rooms[3].x || corridor31.x < rooms[9].x || corridor31.x > rooms[3].x + rooms[3].w - 15) {
          if (leaf4[12].h = leaf4[13].h) {
            corridor31 = this.getCorridorV(rooms[7], rooms[13]);
          } else {
            corridor31 = this.getCorridorV(rooms[7], rooms[14]);
          }
        }
      } else {
        corridor31 = this.getCorridorV(rooms[3], rooms[10]);
        if (corridor31.x < rooms[3].x || corridor31.x < rooms[9].x || corridor31.x > rooms[3].x + rooms[3].w - 15) {
          if (leaf4[0].h = leaf4[1].h) {
            if (leaf4[12].h = leaf4[13].h) {
              corridor31 = this.getCorridorV(rooms[7], rooms[13]);
            } else {
              corridor31 = this.getCorridorV(rooms[7], rooms[14]);
            }
          }
        }
      }
    }
    corridors.push(corridor31);
    myDungeon.push(rooms);
    myDungeon.push(corridors);
    //get health items
    let loc2 = [];
    for (let i = 0; i < 7; i++) {
      const res2 = Math.floor(Math.random() * 14 + 1);
      loc2.push(res2);
    }
    for (let i = 0; i < 7; i++) {
      let obj = {};
      let num = loc2[i];
      obj.x = this.getRandomInt(rooms[num].x, rooms[num].x + rooms[num].w - 15);
      obj.y = this.getRandomInt(rooms[num].y, rooms[num].y + rooms[num].h - 15);
      obj.w = 15;
      obj.h = 15;
      healthItems.push(obj);
    }
    //get enemies
    let loc1 = [];
    for (let i = 0; i < 6; i++) {
      const res1 = Math.floor(Math.random() * 14 + 1);
      loc1.push(res1);
    }
    for (let m = 0; m < 6; m++) {
      let item = {};
      let num3 = loc1[m];
      item.x = this.getRandomInt(rooms[num3].x, rooms[num3].x + rooms[num3].w - 15);
      item.y = this.getRandomInt(rooms[num3].y, rooms[num3].y + rooms[num3].h - 15);
      item.w = 15;
      item.h = 15;
      enemies.push(item);
    }
    //get the boss
    const num2 = Math.floor(Math.random() * 14 + 1);
    boss.x = this.getRandomInt(rooms[num2].x, rooms[num2].x + rooms[num2].w - 15);
    boss.y = this.getRandomInt(rooms[num2].y, rooms[num2].y + rooms[num2].h - 15);
    boss.w = 15;
    boss.h = 15;
    // get the weapon
    const num1 = Math.floor(Math.random() * 14 + 1);
    weapon.x = this.getRandomInt(rooms[num1].x, rooms[num1].x + rooms[num1].w - 15);
    weapon.y = this.getRandomInt(rooms[num1].y, rooms[num1].y + rooms[num1].h - 15);
    weapon.w = 15;
    weapon.h = 15;
    return myDungeon;
  }
  //build a horizontal corridor
  getCorridorH(roomA, roomB) {
    const corridorH = {};
    corridorH.x = roomA.x + roomA.w;
    let min,
      max;
    corridorH.y = this.getRandomInt(min = roomA.y >= roomB.y ?
      roomA.y :
      roomB.y, max = (roomA.y + roomA.h - 20) <= (roomB.y + roomB.h - 20) ?
      roomA.y + roomA.h - 20 :
      roomB.y + roomB.h - 20);
    corridorH.w = Math.abs(roomB.x - (roomA.x + roomA.w));
    corridorH.h = 20;
    return corridorH;
  }
  //build a vertical corridor
  getCorridorV(roomA, roomB) {
    const corridorV = {};
    let min,
      max;
    corridorV.x = this.getRandomInt(min = roomA.x >= roomB.x ?
      roomA.x :
      roomB.x, max = (roomA.x + roomA.w - 20) <= (roomB.x + roomB.w - 20) ?
      roomA.x + roomA.w - 20 :
      roomB.x + roomB.w - 20);
    corridorV.y = roomA.y + roomA.h;
    corridorV.w = 20;
    corridorV.h = Math.abs(roomB.y - (roomA.y + roomA.h));
    return corridorV;
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  getRandom() {
    return Math.random() * (0.60 - 0.43) + 0.43;
  }
  draw(room, myColor) {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.fillStyle = myColor;
    ctx.fillRect(room.x, room.y, room.w, room.h);
  }
  generateDungeon() {
    this
      .state
      .myDungeon[0]
      .map((room) => this.draw(room, "grey")); //rooms
    this
      .state
      .myDungeon[1]
      .map((corridor) => this.draw(corridor, "grey")); //corridors
    healthItems.map((healthItem) => this.draw(healthItem, "green")); //health items
    enemies.map((enemy) => this.draw(enemy, "red")); //enemies
    this.draw(boss, "#430943"); //the boss
    this.draw(weapon, "yellow"); //the weapon
  }
  drawPlayer() {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(this.state.playerX, this.state.playerY, 15, 15);
  }
  clearPlayer() {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.clearRect(this.state.playerX, this.state.playerY, 15, 15);
    ctx.fillStyle = "grey";
    ctx.fillRect(this.state.playerX, this.state.playerY, 15, 15);
  }
  clearPlayerOutside() {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.clearRect(this.state.playerX, this.state.playerY, 15, 15);
    ctx.fillStyle = "black";
    ctx.fillRect(this.state.playerX, this.state.playerY, 15, 15);
  }
  clearItem(B) {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.clearRect(B.x, B.y, B.w, B.h);
    ctx.fillStyle = "grey";
    ctx.fillRect(B.x, B.y, B.w, B.h);
  }
  clearDungeon(B) {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    ctx.clearRect(B.x, B.y, B.w, B.h);
  }
  // check if the player is inside a room and if the player is against a wall or at
  // a corner
  inRoom() {
    let result = {
      count: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      leftTop: 0,
      rightTop: 0,
      leftBottom: 0,
      rightBottom: 0
    };
    let rooms = this.state.myDungeon[0];
    let x = this.state.playerX;
    let y = this.state.playerY;
    for (let i = 0; i < rooms.length; i++) {
      if (x >= rooms[i].x && x + 15 <= rooms[i].x + rooms[i].w && y >= rooms[i].y && y + 15 <= rooms[i].y + rooms[i].h) {
        switch (true) {
          case x === rooms[i].x && y === rooms[i].y:
            result.leftTop += 1;
            break;
          case x === rooms[i].x && y + 15 === rooms[i].y + rooms[i].h:
            result.leftBottom += 1;
            break;
          case x + 15 === rooms[i].x + rooms[i].w && y === rooms[i].y:
            result.rightTop += 1;
            break;
          case x + 15 === rooms[i].x + rooms[i].w && y + 15 === rooms[i].y + rooms[i].h:
            result.rightBottom += 1;
            break;
          case x + 15 === rooms[i].x + rooms[i].w:
            result.right += 1;
            break;
          case y === rooms[i].y:
            result.top += 1;
            break;
          case y + 15 === rooms[i].y + rooms[i].h:
            result.bottom += 1;
            break;
          case x === rooms[i].x:
            result.left += 1;
            break;
          case x > rooms[i].x && y > rooms[i].y && x + 15 < rooms[i].x + rooms[i].w && y + 15 < rooms[i].y + rooms[i].h:
            result.count += 1;
            break;
        }
      }
    }
    return result;
  }
  //check if the player is at either side of a corridor
  atCorridor() {
    let corridors = this.state.myDungeon[1];
    let result = {};
    result.corH = 0;
    result.corV = 0;
    for (let i = 0; i < corridors.length; i++) {
      if (corridors[i].h === 20 && this.state.playerY >= corridors[i].y && this.state.playerY + 15 <= corridors[i].y + 20 && this.state.playerX + 15 >= corridors[i].x && this.state.playerX <= corridors[i].x + corridors[i].w) {
        result.corH += 1; //a horizontal corridor
      } else if (corridors[i].w === 20 && this.state.playerX >= corridors[i].x && this.state.playerX + 15 <= corridors[i].x + 20 && this.state.playerY + 15 >= corridors[i].y && this.state.playerY <= corridors[i].y + corridors[i].h) {
        result.corV += 1; //a vertical corridor
      }
    }
    return result;
  }
  //player gets the weapon
  getWeapon() {
    const numX = this.state.playerX - weapon.x;
    const numY = this.state.playerY - weapon.y;
    if (Math.abs(numX) < 15 && Math.abs(numY) < 15) {
      this.clearItem(weapon);
      switch (this.state.myWeapon) {
        case 'stick':
          myWeapon = 'knife';
          attacks = 18;
          break;
        case 'knife':
          myWeapon = 'bow and arrows';
          attacks = 36;
          break;
        case 'bow and arrows':
          myWeapon = 'sword';
          attacks = 54;
          break;
        case 'sword':
          myWeapon = 'gun';
          attacks = 72;
          break;
      }
      weapon = {};
    }
    this.setState({
      myWeapon: myWeapon,
      attacks: attacks
    });
  }
  //player gets the health items
  gainHealth() {
    for (let i = 0; i < healthItems.length; i++) {
      const numX = this.state.playerX - healthItems[i].x;
      const numY = this.state.playerY - healthItems[i].y;
      if (Math.abs(numX) < 15 && Math.abs(numY) < 15) {
        this.clearItem(healthItems[i]);
        healthItems.splice(i, 1);
        health = health + 7;
      }
    }
    this.setState({
      health: health
    });
  }
  //indicating whether the player is attacking an enemy
  flag() {
    let flag = 0;
    for (let i = 0; i < enemies.length; i++) {
      const numX = this.state.playerX - enemies[i].x;
      const numY = this.state.playerY - enemies[i].y;
      if (Math.abs(numX) <= 15 && Math.abs(numY) <= 15) {
        flag += 1;
      }
    }
    return flag;
  }
  //number of attacks to kill an enemy based on the game level and player's weapon
  getDamages() {
    let damage;
    let gameLevel = level;
    let playerWeapon = myWeapon;
    switch (gameLevel) {
      case 0:
        switch (playerWeapon) {
          case 'stick':
            damage = this.getRandomInt(10, 12);
            break;
          case 'knife':
            damage = this.getRandomInt(5, 7);
            break;
          case 'bow and arrows':
            damage = this.getRandomInt(2, 3);
            break;
          case 'sword':
            damage = this.getRandomInt(1, 2);
            break;
          case 'gun':
            damage = 1;
            break;
        }
        break;
      case 1:
        switch (playerWeapon) {
          case 'stick':
            damage = this.getRandomInt(11, 12);
            break;
          case 'knife':
            damage = this.getRandomInt(6, 8);;
            break;
          case 'bow and arrows':
            damage = this.getRandomInt(3, 4);
            break;
          case 'sword':
            damage = this.getRandomInt(1, 2);
            break;
          case 'gun':
            damage = 1;
            break;
        }
        break;
      case 2:
        switch (playerWeapon) {
          case 'stick':
            damage = this.getRandomInt(12, 14);
            break;
          case 'knife':
            damage = this.getRandomInt(9, 12);;
            break;
          case 'bow and arrows':
            damage = this.getRandomInt(4, 6);
          case 'sword':
            damage = this.getRandomInt(1, 2);
            break;
          case 'gun':
            damage = 1;
            break;
        }
        break;
      case 3:
        switch (playerWeapon) {
          case 'stick':
            damage = this.getRandomInt(12, 15);
            break;
          case 'knife':
            damage = this.getRandomInt(10, 12);;
            break;
          case 'bow and arrows':
            damage = this.getRandomInt(5, 7);
          case 'sword':
            damage = this.getRandomInt(2, 3);
            break;
          case 'gun':
            damage = 1;
            break;
        }
        break;
      case 4:
        switch (playerWeapon) {
          case 'stick':
            damage = this.getRandomInt(15, 16);
            break;
          case 'knife':
            damage = this.getRandomInt(12, 14);;
            break;
          case 'bow and arrows':
            damage = this.getRandomInt(6, 8);
          case 'sword':
            damage = this.getRandomInt(3, 4);
            break;
          case 'gun':
            damage = this.getRandomInt(1, 2);
            break;
        }
        break;
    }
    this.setState({
      damage: damage
    });
    return damage;
  }
  //increase the game level based on player's XP
  getLevel() {
    if (experience < 120) {
      level = 0;
    }
    if (experience >= 120 && experience < 240) {
      level = 1;
      health += 5;
    } else if (experience >= 240 && experience < 360) {
      level = 2;
      health += 10;
    } else if (experience >= 360 && experience < 480) {
      level = 3;
      health += 15;
    } else if (experience >= 480) {
      level = 4;
      health += 20;
    }
    this.setState({
      health: health,
      level: level,
      experience: experience,
      damage: this.getDamages()
    });
  }
  killBoss() {
    const numX = this.state.playerX - boss.x;
    const numY = this.state.playerY - boss.y;
    if (Math.abs(numX) < 15 && Math.abs(numY) < 15) {
      if (this.state.dungeon < 4 && this.state.health >= 10) {
        health = health - 10;
        experience = experience + 30;
        num += 1;
        healthItems.map((item) => this.clearItem(item));
        enemies.map((enemy) => this.clearItem(enemy));
        this
          .state
          .myDungeon[0]
          .map((room) => this.clearDungeon(room));
        this
          .state
          .myDungeon[1]
          .map((corridor) => this.clearDungeon(corridor));
        this.clearPlayer();
        healthItems = [];
        enemies = [];
        boss = {};
        weapon = {};
        let res = this.inRoom();
        if (res.count === 0) {
          this.clearPlayerOutside();
        } else {
          this.clearPlayer();
        }
        this.setState({
          myDungeon: this.getMyDungeon(),
          health: health,
          experience: experience,
          dungeon: num
        });
        const randomRoom = Math.floor(Math.random() * 14);
        this.translateDungeon(this.state.playerX - this.state.myDungeon[0][randomRoom].x, this.state.playerY - this.state.myDungeon[0][randomRoom].y);
        this.setState({
          playerX: this.state.myDungeon[0][randomRoom].x + 20,
          playerY: this.state.myDungeon[0][randomRoom].y + 20
        });
        this.drawPlayer();
      } else if ((this.state.dungeon === 4) && (this.state.health + this.state.experience >= 880)) {
        boss = {};
        play = false;
        this.setState({
          message: "You win!!!"
        });
      } else {
        this.gameOver();
      }
    }
  }
  moveLeft() {
    this.clearPlayer();
    let xMinus = this.state.playerX - 1;
    this.setState({
      playerX: xMinus
    });
    this.translateDungeon(1, 0);
    this.drawPlayer();
  }
  moveRight() {
    this.clearPlayer();
    let xPlus = this.state.playerX + 1;
    this.setState({
      playerX: xPlus
    });
    this.translateDungeon(-1, 0);
    this.drawPlayer();
  }
  moveDown() {
    this.clearPlayer();
    let yPlus = this.state.playerY + 1;
    this.setState({
      playerY: yPlus
    });
    this.translateDungeon(0, -1);
    this.drawPlayer();
  }
  moveUp() {
    this.clearPlayer();
    let yMinus = this.state.playerY - 1;
    this.setState({
      playerY: yMinus
    });
    this.translateDungeon(0, 1);
    this.drawPlayer();
  }
  //make the camera view following the player
  translateDungeon(x, y) {
    const ctx = this
      .refs
      .canvas
      .getContext('2d');
    this
      .state
      .myDungeon[0]
      .map((room) => ctx.clearRect(room.x, room.y, room.w, room.h));
    this
      .state
      .myDungeon[1]
      .map((corridor) => ctx.clearRect(corridor.x, corridor.y, corridor.w, corridor.h));
    ctx.translate(x, y);
    ctx.fillStyle = "grey";
    this
      .state
      .myDungeon[0]
      .map((room) => ctx.fillRect(room.x, room.y, room.w, room.h));
    this
      .state
      .myDungeon[1]
      .map((corridor) => ctx.fillRect(corridor.x, corridor.y, corridor.w, corridor.h));
    ctx.fillStyle = "green";
    healthItems.map((item) => ctx.fillRect(item.x, item.y, item.w, item.h));
    ctx.fillStyle = "red";
    enemies.map((enemy) => ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h));
    ctx.fillStyle = "yellow";
    ctx.fillRect(weapon.x, weapon.y, weapon.w, weapon.h);
    ctx.fillStyle = "#430943";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
  }
  //player make movements
  move(e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
    if (play === true) {
      this.gainHealth();
      this.getWeapon();
      this.killBoss();
      let res = this.inRoom();
      let resC = this.atCorridor();
      if (this.flag()) { //player makes movements killing an enemy
        for (let i = 0; i < enemies.length; i++) {
          const numX = this.state.playerX - enemies[i].x;
          const numY = this.state.playerY - enemies[i].y;
          let damage = this.state.damage;
          if (this.state.health > 0) {
            if (numX === -15 && Math.abs(numY) <= 15) { //player on the left side of the enemy
              if (damage > 0) {
                switch (e.keyCode) {
                  case 39:
                    health -= 1;
                    damage -= 1;
                    this.setState({
                      health: health,
                      damage: damage
                    });
                    break;
                  case 37: //moveLeft
                    this.moveLeft();
                    break;
                  case 40: //moveDown
                    this.moveDown();
                    break;
                  case 38: //moveUp
                    this.moveUp();
                    break;
                }
              } else if (damage <= 0) {
                this.clearItem(enemies[i]);
                enemies.splice(i, 1);
                experience += 30;
                this.getLevel();
                this.setState({
                  experience: experience,
                  damage: this.getDamages()
                });
              }
            } else if (numX === 15 && Math.abs(numY) <= 15) { //player on the right side of the enemy
              if (damage > 0) {
                switch (e.keyCode) {
                  case 37:
                    health -= 1;
                    damage -= 1;
                    this.setState({
                      health: health,
                      damage: damage
                    });
                    break;
                  case 39:
                    this.moveRight();
                    break;
                  case 40:
                    this.moveDown();
                    break;
                  case 38:
                    this.moveUp();
                    break;
                }
              } else if (damage <= 0) {
                this.clearItem(enemies[i]);
                enemies.splice(i, 1);
                experience += 30;
                this.getLevel();
                this.setState({
                  experience: experience,
                  damage: this.getDamages()
                });
              }
            } else if (numY === 15 && Math.abs(numX) <= 15) { //player at the bottom of the enemy
              if (damage > 0) {
                switch (e.keyCode) {
                  case 38:
                    health -= 1;
                    damage -= 1;
                    this.setState({
                      health: health,
                      damage: damage
                    });
                    break;
                  case 37:
                    this.moveLeft();
                    break;
                  case 39:
                    this.moveRight();
                    break;
                  case 40:
                    this.moveDown();
                    break;
                }
              } else if (damage <= 0) {
                this.clearItem(enemies[i]);
                enemies.splice(i, 1);
                experience += 30;
                this.getLevel();
                this.setState({
                  experience: experience,
                  damage: this.getDamages()
                });
              }
            } else if (numY === -15 && Math.abs(numX) <= 15) { //player on top of the enemy
              if (damage > 0) {
                switch (e.keyCode) {
                  case 40:
                    health -= 1;
                    damage -= 1;
                    this.setState({
                      health: health,
                      damage: damage
                    });
                    break;
                  case 37:
                    this.moveLeft();
                    break;
                  case 39:
                    this.moveRight();
                    break;
                  case 38:
                    this.moveUp();
                    break;
                }
              } else if (damage <= 0) {
                this.clearItem(enemies[i]);
                enemies.splice(i, 1);
                experience += 30;
                this.getLevel();
                this.setState({
                  experience: experience,
                  damage: this.getDamages()
                });
              }
            }
          } else {
            this.gameOver();
          }
        }
      } else if (resC.corH > 0) { //player inside a horizontal corridor
        switch (e.keyCode) {
          case 39:
            this.moveRight();
            break;
          case 37:
            this.moveLeft();
            break;
        }
      } else if (resC.corV > 0) { //player inside a vertical corridor
        switch (e.keyCode) {
          case 40:
            this.moveDown();
            break;
          case 38:
            this.moveUp();
            break;
        }
      } else if (res.count > 0) { //player inside a room
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 38:
            this.moveUp();
            break;
          case 39:
            this.moveRight();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.left > 0) { //player against the wall on the left side
        switch (e.keyCode) {
          case 38:
            this.moveUp();
            break;
          case 39:
            this.moveRight();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.right > 0) { //player against the wall on the right side
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 38:
            this.moveUp();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.top > 0) { //player against the wall on the top
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 39:
            this.moveRight();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.bottom > 0) { //player against the wall on the bottom
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 38:
            this.moveUp();
            break;
          case 39:
            this.moveRight();
            break;
        }
      } else if (res.leftTop > 0) { //player at the left corner on the top
        switch (e.keyCode) {
          case 39:
            this.moveRight();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.rightTop > 0) { //player at the right corner on the top
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 40:
            this.moveDown();
            break;
        }
      } else if (res.leftBottom > 0) { //player at the left corner on the bottom
        switch (e.keyCode) {
          case 39:
            this.moveRight();
            break;
          case 38:
            this.moveUp();
            break;
        }
      } else if (res.rightBottom > 0) { //player at the right corner on the bottom
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 38:
            this.moveUp();
            break;
        }
      }
    }
  }
  //change the size of the viewport
  toggleDarkness() {
    if (this.state.height < 300) {
      this.setState({
        width: 580,
        height: 580
      });
    } else {
      this.setState({
        width: 200,
        height: 200
      });
    }
  }
  gameOver() {
    play = false;
    this.setState({
      message: "You are killed. Game over!"
    });
  }
  render() {
    return ( <
      div className = "App" >
      <
      h1 id = "title"
      className = "text-center" > A Roguelike Dungeon Crawler Game < /h1> <
      div id = "display" >
      <
      span className = "scores" > Health: {
        this.state.health
      } < /span> <
      span className = "scores" > Weapon: {
        this.state.myWeapon
      } < /span> <
      span className = "scores" > Attacks: {
        this.state.attacks
      } < /span> <
      span className = "scores" > Level: {
        this.state.level
      } < /span> <
      span className = "scores" > XP: {
        this.state.experience
      } < /span> <
      span className = "scores" > Dungeon: {
        this.state.dungeon
      } < /span> <
      span className = "scores" > Kill the boss in Dungeon 4 < /span> <
      span className = 'buttons' > < a href = "https://github.com/ziweidream/roguelike-dungeon-crawler-game"
      style = {
        {
          color: "white"
        }
      } > view source code < /a></span >
      <
      button className = 'btn buttons'
      onClick = {
        () => window.location.reload()
      } > Reset < /button> <
      button className = 'btn buttons'
      onClick = {
        () => this.toggleDarkness()
      } > Toggle Darkness < /button>           <
      h1 className = "text-center" > {
        this.state.message
      } < /h1> <
      /div> <
      div className = "imageContainer"
      style = {
        {
          clipPath: 'url(#cross)',
          overflow: "hidden"
        }
      } >
      <
      canvas ref = "canvas"
      width = "1500"
      height = "1500" / >
      <
      svg height = "0"
      width = "0" >
      <
      defs >
      <
      clipPath id = "cross" >
      <
      rect y = "98"
      x = "400"
      width = {
        this.state.width
      }
      height = {
        this.state.height
      }
      /> <
      /clipPath> <
      /defs> <
      /svg> <
      /div> <
      /div>
    );
  }
}

export default App;