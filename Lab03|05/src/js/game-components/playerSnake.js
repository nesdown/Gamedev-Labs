import Snake from './snake';
import Util from './util';
import { randomBytes } from 'crypto';
var notepack = require('notepack');
/**
 * Player of the core snake for controls
 * @param  {Phaser.Game} game      game object
 * @param  {Array<Number>} spriteKey Phaser sprite key
 * @param  {Number} x         coordinate
 * @param  {Number} y         coordinate
 */
const PlayerSnake = function(game, spriteKey, x, y, ang, s, initFood, socket, index) {
    Snake.call(this, game, spriteKey, x, y, ang, s, window.localStorage.getItem("user_name"));
    this.started = null;
    this.initFood = initFood;
    this.game.score.setText('Score: ' + this.price / 100 + '$');
    this.game.balance = this.price / 100;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.moves = false;
    this.socket = socket;
    this.id = index;
    
    //handle the space key so that the player's snake can speed up
    var spaceKey = this.game.input.activePointer.leftButton; //this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var self = this;
    spaceKey.onDown.add(this.spaceKeyDown, this);
    spaceKey.onUp.add(this.spaceKeyUp, this);
    this.addDestroyedCallback(function() {
        spaceKey.onDown.remove(this.spaceKeyDown, this);
        spaceKey.onUp.remove(this.spaceKeyUp, this);
    }, this);
    this.addDestroyedCallback(function() {
        this.game.score.setText('Score: 0');
	this.game.balance = 0;
    }, this);
}

PlayerSnake.prototype = Object.create(Snake.prototype);
PlayerSnake.prototype.constructor = PlayerSnake;

PlayerSnake.prototype.incrementSize = function(price) {
    Snake.prototype.incrementSize.call(this, price);
    this.game.score.setText('Score: ' + this.price / 100 + '$');
    this.game.balance = this.price / 100;
}

//make this snake light up and speed up when the space key is down
PlayerSnake.prototype.spaceKeyDown = function() {
    this.started = {x: this.head.body.x, y: this.head.body.y};
    this.speed = this.fastSpeed;
    this.shadow.isLightingUp = true;
}
//make the snake slow down when the space key is up again
PlayerSnake.prototype.spaceKeyUp = function() {
    this.started = null;
    this.speed = this.slowSpeed;
    this.shadow.isLightingUp = false;
}

/**
 * Add functionality to the original snake update method so that the player
 * can control where this snake goes
 */
var data = {};
var old = {}

// setInterval(function(){
//   //  console.log('300')
  
// if(data.socket && data !== old ){
//     old = data
//     data.socket.emit('move player', { x: data.x, y: data.y, angle: data.angle})
// }
// },500)
PlayerSnake.prototype.tempUpdate = PlayerSnake.prototype.update;
PlayerSnake.prototype.update = function() {
    
    //find the angle that the head needs to rotate
    //through in order to face the mouse
    var mousePosX = this.game.input.activePointer.worldX;
    var mousePosY = this.game.input.activePointer.worldY;
    var headX = this.head.body.x;
    var headY = this.head.body.y;
    var angle = (180*Math.atan2(mousePosX-headX,mousePosY-headY)/Math.PI);
    if (angle > 0) {
        angle = 180-angle;
    }
    else {
        angle = -180-angle;
    }

    data = { x: headX, y: headY, angle: angle, socket:this.socket};
    //MR
    var encoded = notepack.encode({ x: headX, y: headY, angle: angle}); // <Buffer 81 a3 66 6f 6f a3 62 61 72>
   
    // console.log('emit', this)
    this.socket.emit('move player', encoded)
    //MR

    if (this.speed === this.fastSpeed && this.started) {
        if (this.price <= this.basePrice + 3) this.spaceKeyUp();
        else if (Util.distanceFormula(headX, headY, this.started.x, this.started.y) > 20) {
            this.started.x = headX;
            this.started.y = headY;
            const last = this.sections[this.sections.length-1];
            this.id = headX;
            this.initFood(last.x, last.y, 2, 2, this.game, this.socket, this.id); //TODO server
            this.price -= 3;

            this.game.score.setText('Score: ' + this.price / 100 + '$');
            this.game.balance = this.price / 100;

            if (this.snakeLength - 3 > (this.price - this.basePrice) / this.growth) {
                this.snakeLength--;
                last.destroy();
                this.sections.pop();
                this.shadow.shadows[this.shadow.shadows.length - 1].destroy();
                this.shadow.shadows.pop();
                this.setScale(this.scale / 1.001);

                this.spriteKey.push(this.spriteKey.shift());
            }
        }
    }
    
    var dif = this.head.body.angle - angle;
    this.head.body.setZeroRotation();
    //allow arrow keys to be used
    if (this.cursors.left.isDown) {
        this.head.body.rotateLeft(this.rotationSpeed);
    }
    else if (this.cursors.right.isDown) {
        this.head.body.rotateRight(this.rotationSpeed);
    }
    //omit rotation if angle difference is not significant
    // else if (dif < 10 && dif > -10 || dif > 350 || dif < -350) {}
    //decide whether rotating left or right will angle the head towards
    //the mouse faster, if arrow keys are not used
    else if (dif < 0 && dif > -180 || dif > 180) {
        this.head.body.rotateRight(this.rotationSpeed);
    }
    else if (dif > 0 && dif < 180 || dif < -180) {
        this.head.body.rotateLeft(this.rotationSpeed);
    }
    
    for (var i = 0; i < this.shadow.shadows.length; i++) {
        this.shadow.shadows[i].alpha = 0;
        this.shadow.shadows[i].naturalAlpha = 0;
    }
    
    if (!this.moves) {
        this.moves = true;
        this.sections.forEach((section, i, sections) => {
            const { x: x1, y: y1 } = section;
            const { x: x2, y: y2 } = (i > 0) ? sections[i-1] : {x: mousePosX, y: mousePosY};
            const { x, y } = Util.interpol(x1, y1, x2, y2, 20);
            if (!section.tween)
                section.tween = this.game.add.tween(section.body).to({ x, y }, 50, null, true);
            section.tween.onComplete.add(sneik => (console.log(sneik), this.moves = false), this);
            // this.shadows(x, y, i);
            // tween.start();
            // if (i === 0) console.log({tween});
        });
    }
  
    //call the original snake update method
    this.tempUpdate();
};
PlayerSnake.prototype.shadows = function(x, y, i) {
    var shadow = this.shadow.shadows[i];
    const tween = this.game.add.tween(shadow.position).to({ x, y }, 50, null, true);
    // tween.start();

    if (i === 0) {
        //light up shadow with bright tints
        if (this.shadow.isLightingUp) {
            this.shadow.lightUpdateCount++;
            if (this.shadow.lightUpdateCount >= this.shadow.updateLights) {
                this.shadow.lightUp();
            }
        }
        //make shadow dark
        else {
            for (var i = 0; i < this.shadow.shadows.length; i++) {
                var shadow = this.shadow.shadows[i];
                shadow.tint = this.shadow.darkTint;
            }
        }
    }
}

export default PlayerSnake;
