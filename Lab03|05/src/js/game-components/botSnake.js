import Snake from './snake';
import Util from './util';

/**
 * Bot extension of the core snake
 * @param  {Phaser.Game} game      game object
 * @param  {Array<Number>} spriteKey Phaser sprite key
 * @param  {Number} x         coordinate
 * @param  {Number} y         coordinate
 */
const BotSnake = function(game, spriteKey, x, y, ang, s, index, name) {
    //console.log(game, spriteKey, x, y, ang, s, index, name)
    Snake.call(this, game, spriteKey, x, y, ang, s, name, index);
    this.trend = 1;
}

BotSnake.prototype = Object.create(Snake.prototype);
BotSnake.prototype.constructor = BotSnake;
 
BotSnake.prototype.incrementSize = function(price) {
    Snake.prototype.incrementSize.call(this, price);
    this.game.score.setText('Score: ' + this.price / 100 + '$');
    this.game.balance = this.price / 100;
}

/**
 * Add functionality to the original snake update method so that this bot snake
 * can turn randomly
 */
BotSnake.prototype.tempUpdate = BotSnake.prototype.update;
BotSnake.prototype.update = function() {
    // this.head.body.setZeroRotation();
    // const { x: x1, y: y1 } = this.sections[1];
    // const { x: x2, y: y2 } = this.sections[0];
    // const { x, y } = Util.interpol(x1, y1, x2, y2, 50);

    // if (x < -2000 && y1 > y2) {
    //     this.head.body.rotateLeft(this.rotationSpeed);
    // }
    // else if (x < -2000 && y2 > y1) {
    //     this.head.body.rotateRight(this.rotationSpeed);
    // }
    // else if (x > 2000 && y1 > y2) {
    //     this.head.body.rotateRight(this.rotationSpeed);
    // }
    // else if (x > 2000 && y2 > y1) {
    //     this.head.body.rotateLeft(this.rotationSpeed);
    // }
    // else if (y < -2000 && x1 > x2) {
    //     this.head.body.rotateRight(this.rotationSpeed);
    // }
    // else if (y < -2000 && x2 > x1) {
    //     this.head.body.rotateLeft(this.rotationSpeed);
    // }
    // else if (y > 2000 && x1 > x2) {
    //     this.head.body.rotateLeft(this.rotationSpeed);
    // }
    // else if (y > 2000 && x1 > x2) {
    //     this.head.body.rotateRight(this.rotationSpeed);
    // }
    // else {
    //     //ensure that the bot keeps rotating in one direction for a
    //     //substantial amount of time before switching directions
    //     if (Util.randomInt(1, 10) === 1) {
    //         this.trend *= -1;
    //     }
    //     this.head.body.rotateRight(this.trend * this.rotationSpeed);
    // }
    this.tempUpdate();
},
BotSnake.prototype.movePlayer = function({x,y,angle}){
   // console.log(x, this.head.body)
    if(this.head.body){
       // this.head.body.setZeroRotation();
        // const { x: x2, y: y2 } = this.sections[0];
        // const { x, y } = Util.interpol(x, y, x2, y2, 50);
    this.head.body.x = x;
    this.head.body.y = y;
    this.head.body.angle = angle;
    this.tempUpdate();
    }

}

export default BotSnake;
