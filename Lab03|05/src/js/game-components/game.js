import PlayerSnake from './playerSnake';
import BotSnake from './botSnake';
import Util from './util';
import Food from './food';
import MicroModal from "micromodal";
import io from 'socket.io-client'
var notepack = require('notepack');

const costs = [0.5, 1, 2, 3.5];
const Game = function(game) {};

Game.prototype = {
    preload: function() {
        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading...', { font: '32px "Luckiest Guy"', fill: '#dddddd', align: 'center' })
        text.anchor.setTo(0.5, 0.5);
        //load assets
        // this.game.load.image('circle', 'asset/circle.png');
        this.game.load.image('circle1', 'media/img/circle-1.png');
        this.game.load.image('circle2', 'media/img/circle-2.png');
        this.game.load.image('circle3', 'media/img/circle-3.png');
        this.game.load.image('circle4', 'media/img/circle-4.png');
        this.game.load.image('circle5', 'media/img/circle-5.png');
        this.game.load.image('circle6', 'media/img/circle-6.png');
    	  this.game.load.image('shadow', 'media/img/white-shadow.png');
    	// this.game.load.image('background', 'asset/tile.png');
        this.game.load.image('background0', 'media/img/Background.png');
        this.game.load.image('background1', 'media/img/Background-1.png');
        this.game.load.image('background2', 'media/img/Background-2.png');
        this.game.load.image('background3', 'media/img/Background-3.png');
        this.game.load.image('background4', 'media/img/Background-4.png');
        this.game.load.image('background5', 'media/img/Background-5.png');
        this.game.load.image('background6', 'media/img/Background-6.png');

        this.game.load.image('map', 'media/img/msp.png');

    	this.game.load.image('eye-white', 'media/img/eye-white.png');
    	this.game.load.image('eye-black', 'media/img/eye-black.png');

        this.game.load.image('food', 'media/img/food.png');
    },
    create: function() {
        const allSkins = [[1], [2], [3], [4], [5], [6], [3, 2], [4, 1], [4, 2, 3, 1, 6]];
        const playerSkinInd = window.localStorage.getItem("skin") || '1';
        const playerSkin = allSkins[+playerSkinInd - 1];
        const skins = allSkins.filter((s, i) => i !== +playerSkinInd - 1);
        var width = 2000;
        var height = 2000;
        this.width = width;
        this.height = height;
        //var globalwidth = 2500;
        //var globalheight = 2500;
        this.game.balance = 0;
        this.game.world.setBounds(-2500, -2500, 5000, 5000);
    	  this.game.stage.backgroundColor = '#111';

        //add tilesprite background
         var background = this.game.add.tileSprite(-2000, -2000,
             4000, 4000, 'background0');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.setBounds(-width, -height, width*2, height*2, true, true, true, true);
       
        
        //add food randomly
        // for (let i = 0; i < 15; i++) {
        //     for (let j = 0; j < 2; j++) {
        //         this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height), 3, costs[3]);
        //     }

        //     for (let j = 0; j < 10; j++) {
        //         this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height), 2, costs[2]);
        //     }

        //     for (let j = 0; j < 20; j++) {
        //         this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height), 1, costs[1]);
        //     }

        //     for (let j = 0; j < 20; j++) {
        //         this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height), 0, costs[0]);
        //     }
        // }

        this.game.score = this.game.add.text(this.game.width - 225, 20, 0, {font: 'bold 32px "Luckiest Guy"', fill: '#ffffff'});
        this.game.score.fixedToCamera = true;
        this.game.leaderboard = this.game.add.text(this.game.width - 225, 72, '', {font: 'bold 20px "Luckiest Guy"', fill: '#ffffff'});
        this.game.leaderboard.fixedToCamera = true;

        // this.game.leaderboard.scores = {}
        this.game.updateLeaderboard = () => {
            if (this.game.device.desktop) {
                const scores = this.game.snakes.map(snake => ({name: snake.name, price: snake.price / 100}));
                const ranged = scores.sort((a, b) => b.price - a.price).slice(0, 10);
                const string = ranged.reduce((a, v) => a + `\n${v.name} - ${v.price}$`, '');
                this.game.leaderboard.setText('Leaderboard:' + string);
            } else {
                const place = this.game.snakes.sort((a, b) => b.price - a.price).findIndex(e => e instanceof PlayerSnake);
                const total = this.game.snakes.length;
                this.game.leaderboard.setText('Place: ' + (place + 1) + '/' + total);
            }
        };
        //this.game.score.anchor.set(0.5, 0);
        //this.game.score.alignIn(this.game, Phaser.TOP_RIGHT, 0, 0);

        this.game.snakes = [];

        const sx = 6, sy = 6;
        const spawn = (nx, ny) => Util.spawn(-width, -height, width*2, height*2, 200, 200, sx, sy, nx, ny);

        const excluded = [];
        for (let i = 0; i < 7; i++) excluded.push({x: Util.randomInt(0, 5), y: Util.randomInt(0, 5)});

        const playerSpawn = spawn(excluded[0].x, excluded[0].y);
        
        //console.log('skin', playerSkin);


        ///MR
        this.players = [];
        //this.initFood = this.initFood;
        // this.foodGroup = [];
        // Connect to socket
        this.socket = io('http://' + window.location.hostname + ':8181');
        //this.socket = io('http://www.snakemoney.io/');
        /// MR

        //create player
        this.player = new PlayerSnake(this.game, playerSkin, playerSpawn.x, playerSpawn.y, 90, 2, this.initFood.bind(this), this.socket, ["me"]);
        this.game.camera.follow(this.player.head);


         // Socket connection successful
        this.socket.on('connect', this._onSocketConnected.bind(this))

        // Socket disconnection
        this.socket.on('disconnect', this._onSocketDisconnect)

        // New player message received
        //this.socket.on('food group', this._onFoodGroup.bind(this))

        // New player message received
        this.socket.on('new player', this._onNewPlayer.bind(this))

      
        // New player message received
        this.socket.on('food group', this._onFoodGroup.bind(this))

        this.socket.on('food group add', this._onFoodGroupAdd.bind(this))
        
        // Move player
        this.socket.on('move player', this._onMovePlayer.bind(this))

        this.socket.on('move players', this._onMovePlayers.bind(this))


        // Grow player
        this.socket.on('grow player', this._onGrowPlayer.bind(this))

        // Destroyed player
        this.socket.on('destroyed player', this._onRemovePlayer.bind(this))

        // Rotate player

        // Player removed message received
        this.socket.on('remove player', this._onRemovePlayer.bind(this))


        //create bots
        // for (let i = 0; i < sx; i++)
        //     for (let j = 0; j < sy; j++)
        //         if (!excluded.find(e => e.x === i && e.y === j))
        //             new BotSnake(this.game, skins[Util.randomInt(0, skins.length-1)], spawn(i, j).x, spawn(i, j).y, Util.randomInt(0, 360), 2);

        //initialize snake groups and collision
        for (var i = 0 ; i < this.game.snakes.length ; i++) {
            var snake = this.game.snakes[i];
            snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            snake.head.body.collides([this.foodCollisionGroup]);
            //snake.head.body.collideWorldBounds = true;
            snake.head.body.collideWorldBounds = true;
            snake.head.body.onWorldBounds = true;
            //callback for when a snake is destroyed
            snake.addDestroyedCallback(this.snakeDestroyed, this);
        }
        this.game.time.advancedTiming = true;

        this.game.score.bringToTop();
        this.game.leaderboard.bringToTop();
        this.map = this.game.add.image(this.game.width - 225, this.game.height - 225, 'map');
        this.map.fixedToCamera = true;
        this.initDots(this.map.x, this.map.y, this.map.width, this.map.height);
        this.game.notification = this.game.add.text(20, this.game.height - 60, '', {font: 'bold 32px "Luckiest Guy"', fill: '#ffffff'})
        this.game.notification.fixedToCamera = true;
    },
    /**
     * Main update loop
     */
    update: function() {
        //update game components
    
        for (var i = this.game.snakes.length - 1 ; i >= 0 ; i--) {
            this.game.snakes[i].update();
        }
        for (var i = this.foodGroup.children.length - 1 ; i >= 0 ; i--) {
            var f = this.foodGroup.children[i];
            f.food.update();
        }
//        this.updateUnitDots();
    },
    /**
     * Create a piece of food at a point
     * @param  {number} x x-coordinate
     * @param  {number} y y-coordinate
     * @return {Food}   food object created
     */
    initFood: function(x, y, tint, cost, game, socket, food_id) {
        var f = new Food(game, x, y, tint, cost, socket, food_id);
        f.sprite.scale.setTo(1.5, 1.5);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    },
    snakeDestroyed: function(snake) {
      if (snake instanceof PlayerSnake) {

     // ////console.log(snake,'destroyed-init')
        //place food where snake was destroyed
        let game = this.game;
        let socket = this.socket;
        let price = snake.price;
        let li = 0;
        let foodsItem = [];
        while (price > 0) 
            const i = Util.randomInt(0, snake.headPath.length - 1);
            const x = Util.randomInt(0, costs.length - 1);
            const cost = (price > 5) ? costs[x] : price;
            // this.initFood(
            //     snake.headPath[i].x + Util.randomInt(-10,10),
            //     snake.headPath[i].y + Util.randomInt(-10,10),
            //     x,
            //     cost,
            //     game,
            //     socket
            // );
            foodsItem.push({ x: snake.headPath[i].x + Util.randomInt(-10,10),
            y: snake.headPath[i].y + Util.randomInt(-10,10),
            tint: x,
            cost: cost});

            price -= cost;
            li++;
        }
       // //console.log(foodsItem)
       if(snake.id == 'me'){
        snake.id = this.socket.id
       } 


    var destroyedPlayernewEncode = notepack.decode({player_id:snake.id, foodsItem: foodsItem}); 
      this.socket.emit('destroyed player', destroyedPlayernewEncode);

//        //console.log('generated food', li);
//        for (var i = 0 ; i < snake.headPath.length ;
//        i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
//            this.initFood(
//                snake.headPath[i].x + Util.randomInt(-10,10),
//                snake.headPath[i].y + Util.randomInt(-10,10),
//                snake.price * 2 / snake.snakeLength
//            );
//        }
//        console.log('ded', snake.price);
            this.game.endGame();
        }
    },
    render: function () {
        this.game.debug.text(this.game.time.fps, this.game.width/2, this.game.height/2, '#f51113', '24px "Luckiest Guy"');
        this.drawDots();
    },
    initDots: function (x1, y1, w, h) {
        this.dots = this.game.add.graphics(x1 + w / 2, y1 + h / 2);
        this.dots.fixedToCamera = true;
        this.drawDots();
    },
    drawDots: function (w, h) {
        this.dots.clear();
        this.game.snakes.forEach(snake => {
            if (Util.distanceFormula(snake.head.body.x, snake.head.body.y, 0, 0) < 2000) {
                const x = snake.head.body.x * this.map.width / this.width / 2;
                const y = snake.head.body.y * this.map.height / this.height / 2;
                this.dots.beginFill((snake instanceof PlayerSnake) ? 0xff0000 : 0xffffff);
                this.dots.drawRect(x, y, 5, 5);
                this.dots.endFill();
            }
        });
    },
    /******************** 
  ** Private helpers **
  ********************/

  _handleFoodColision: function(head, food) {
   // console.log('_handleColision food', food);

    this.player.grow(food)
    food.kill()
  },

  _handlePlayerColision (me, them) {
    //console.log('_handlePlayerColision', me, them)
  },

  _processHandler (head, food) { 
    //console.log('_processHandler', arguments);

    return true;
  },

  /*******************
  ** Event handlers **
  *******************/

  _onSocketConnected () {
    //console.log('_onSocketConnected Connected to socket server')

    // Reset enemies on reconnect
    this.players.forEach(function(player) {
      player.kill()
    })
    this.players = [];

   // //console.log(this.player);
    let name = window.localStorage.getItem("user_name");
    const allSkins = [[1], [2], [3], [4], [5], [6], [3, 2], [4, 1], [4, 2, 3, 1, 6]];
        const playerSkinInd = window.localStorage.getItem("skin") || '1';
        const playerSkin = allSkins[+playerSkinInd - 1];
    // Send local player data to the game server
    var nePlayerEncode = notepack.encode({ x: this.player.head.x, y: this.player.head.x, angle: this.player.head.angle, name: name, skin:playerSkin}); 

    this.socket.emit('new player', nePlayerEncode)
  },

  _onFoodGroup (data) {
    console.log(data);
    var foodItem = notepack.decode(data); 
    //console.log('_onFoodGroup',foodItem)
    this.foodGroup.children = [];    
    let self = this;

    // data.forEach(function(foodItem) {

    //   // var food = self.foodGroup.children.find(function(foodItem) {
    //   //   return foodItem.food.food_id == foodItem.food_id;
    //   // })
    //   // ////console.log(food)
    //   // if(!food){
    //   self.initFood(foodItem.x,foodItem.y, foodItem.tint, foodItem.cost, self.game, self.socket, foodItem.food_id);
    //  // }
    // })
var i;
    for(i=0; i < foodItem.length; i++){
      
      self.initFood(foodItem[i].x,foodItem[i].y, foodItem[i].tint, foodItem[i].cost, self.game, self.socket, foodItem[i].food_id);

    }
   
  },

  _onNewPlayer (data) {


    var newPlayer = notepack.decode(data); 
    //console.log('New player connected:', data)

    // Avoid possible duplicate players
    var duplicate = this.players.find(function(player){
      return player.id == newPlayer.id;
    })
    if (duplicate) {
      //console.log('Duplicate player!')
      return
    }

    
    // Add new player to the remote players array

    var player = new BotSnake(this.game, newPlayer.skin, newPlayer.x,  newPlayer.y, 90, 2, newPlayer.id, newPlayer.name)
   
    this.players.push(player)
   // //console.log({server_players_count: data.players_count,client_players_count:this.players.length, all_with_me_players:this.game.snakes.length})

    
    ////console.log(this.game.snakes,'this.game.snakes', );
    // var snake = player;
    // snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
    // snake.head.body.collides([this.foodCollisionGroup]);
    // //snake.head.body.collideWorldBounds = true;
    // snake.head.body.collideWorldBounds = true;
    // snake.head.body.onWorldBounds = true;
    // //callback for when a snake is destroyed
    // snake.addDestroyedCallback(this.snakeDestroyed, this);   

  },


  _onFoodGroupAdd (data) {
    //console.log('_onFoodGroupAdd');

    var foodGroupAdd = notepack.decode(data);
    //this.foodGroup.children = [];    
    let self = this;

    foodGroupAdd.forEach(function(foodItem) {

      var food = self.foodGroup.children.find(function(foodItem) {
        return foodItem.food.food_id == foodItem.food_id;
      })
      ////console.log(food)
      if(!food){
      self.initFood(foodItem.x,foodItem.y, foodItem.tint, foodItem.cost, self.game, self.socket, foodItem.food_id);
      }
    })
   
  },

  _onMovePlayer: function(data) {
    // //console.log("MOVE")
//console.log(data)
    var movePlayer = notepack.decode(data);
    var player = this.players.find(function(player){
      return player.id == movePlayer.id;
    })

    // Player not found
    if (!player) {
     // this.socket.emit('destroyed player', {player_id:data.id, foodsItem: []});

      //console.log('Player not found: ', data.id)
      return
    }

    // Update player position
    player.movePlayer({x:movePlayer.x, y:movePlayer.y, angle:movePlayer.angle})
  },

  _onMovePlayers: function(players) {
    console.log('_onMovePlayers',players);
    if(players){
    var movePlayers = notepack.decode(players);
   
    var i;
    for(i=0; i < movePlayers.length; i++){
      var player = this.movePlayers.find(function(player){
        return player.id == movePlayers[i].id;
      })

      // Player not found
      if (!player) {
      // this.socket.emit('destroyed player', {player_id:data.id, foodsItem: []});
      //  //console.log('Player not found: ', players[i].id)
      } else {
      // Update player position
      player.movePlayer({x:movePlayers[i].x, y:movePlayers[i].y, angle:movePlayers[i].angle})
      }
    }
   }
  },

  _onGrowPlayer (data) {
    var growPlayer = notepack.decode(data);
   //////console.log('_onGrowPlayer players',  );
     var player = this.players.find(function(player){
       return player.id == growPlayer.id;
     })
    //  var bufView = new Uint8Array(data.buff);
    // ////console.log(msg)
     // Player not found
     if (!player) {
     //  //console.log('Player not found: ', data.id)
       return
    }

    //Update player position
    player.incrementSize(growPlayer.cost)

    //Remove food item
    ////console.log(this.foodGroup.children,'this.foodGroup.children')
    var food = this.foodGroup.children.find(function(foodItem) {
      return foodItem.food.food_id == growPlayer.food_id;
    })
    if(food){
    this.foodGroup.remove(food);
    }

    //this.foodGroup.children.splice(this.foodGroup.children.indexOf(food), 1)
  },

  _onRemovePlayer (data) {

    var removePlayer = notepack.decode(data);
  // //console.log('_onRemovePlayer');
  // //console.log('players orP',this.players);
  ////console.log(data.id, this.player.socket.id)
   if(removePlayer.id == this.player.socket.id){
    this.game.endGame();
   }

    var player = this.game.snakes.find(function(player){
      //console.log(player,'1')
      return player.id == removePlayer.id;
    })
    ////console.log(this.game.snakes, player);
    // // Player not found
    if (!player) {
      //console.log('Player not found: ', data.id)
      return
    }
    // Remove player from array
    if(player){
      player.destroy();
     // this.game.snakes.remove(player);
    }
    // this.players.remove(player);
    // this.players.splice(this.players.indexOf(player), 1)
  
  }
};


export default Game;
