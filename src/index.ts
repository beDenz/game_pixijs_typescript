import * as PIXI from 'pixi.js';
import * as PIXI_CANVAS from 'pixi.js-legacy';



const createGameWebGL = () => new PIXI.Application({
    width: window.innerWidth-20,
    height: window.innerHeight-20,
    backgroundColor: 0x66ccff
});

const createGameCanvas = () => new PIXI_CANVAS.Application({
    width: window.innerWidth-100,
    height: window.innerHeight-100,
    backgroundColor: 0x66ccff
});

const randomInt = (min:number, max:number):number => Math.floor(min + Math.random() * (max + 1 - min));


let game:PIXI.Application;

PIXI.utils.isWebGLSupported() ? game = createGameWebGL() : game = createGameCanvas();


type colorMatrixConfig = number;
const colorMatrix:colorMatrixConfig[] = [0xff0000, 0x00ff00, 0xff00ff, 0xcccc00, 0x009933, 0xb300b3];


document.body.appendChild(game.view);



class square extends PIXI.Sprite {

    constructor(x:number, y: number, color:number) {
        super();
        this.anchor.set(0.5);
        this.width = 100;
        this.height = 100;  
        this.texture = PIXI.Texture.WHITE;
        this.position.x = x;       
        this.position.y = y;        
        this.tint = color;         
        this.interactive = true;

       
    }
}

class board extends PIXI.Container {

    private _gameSceneBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 800, 800).endFill();
    
    private _activeSpriteArray:any = [];
    private _collisionSquares:any = [];

    constructor() {
        super();
        this.width = 800;
        this.height = 800;
        this.position.x = 100;
        this.position.y = 100;
        this._setBackground();

    }

    private _setBackground() {
        this.addChild(this._gameSceneBackground);
    }

    public startGame():void { 
        for (let row = 50; row < 800; row+=100) {
            for (let col = 50; col < 800; col+=100) {
                const sprite = new square(row, col , colorMatrix[randomInt(0,5)]);
                sprite.on("click",this._onChangePosition, this);   
                this.addChild(sprite);             
            }
        }
    }

    private _moveSquare(object1:square, object2:square):void {

        if (object1.position.y === object2.position.y && Math.abs(object1.position.x - object2.position.x) === object1.width || 
            object1.position.x === object2.position.x && Math.abs(object1.position.y - object2.position.y) === object2.height)  {
                let tempX:number = object1.position.x;
                let tempY:number = object1.position.y;

                object1.position.x = object2.position.x;
                object1.position.y = object2.position.y;

                object2.position.x = tempX;
                object2.position.y = tempY;
            }
    }

    private _onChangePosition(event:PIXI.interaction.InteractionEvent):void {
        this._activeSpriteArray = [...this._activeSpriteArray, event.currentTarget];
        
        if (this._activeSpriteArray.length === 2) {        
            this._moveSquare(this._activeSpriteArray[0], this._activeSpriteArray[1]);
            
            this._activeSpriteArray = [];
        }
            
    }

    private _checkCollisionSquares(object1:square, object2:square):boolean {
        return object1.tint === object2.tint && (object1.position.y === object2.position.y && Math.abs(object1.position.x - object2.position.x) === object1.width || object1.position.x === object2.position.x && Math.abs(object1.position.y - object2.position.y) === object2.height);
    }

    public setCollisionSquares():void {        
        this._collisionSquares = this.children.filter((item:any) => this.children.some((item2:any) => this._checkCollisionSquares(item, item2)));
    }

    public destroySquares():void {
        this._collisionSquares.forEach((item:any) => this.removeChild(item));
    }


}

const moving = () => {
    gameScene.setCollisionSquares();
    gameScene.destroySquares();
}

const gameScene = new board;

console.log(gameScene);

game.ticker.add(() => moving());

game.stage.addChild(gameScene);


gameScene.startGame();





