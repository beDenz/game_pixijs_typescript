import * as PIXI from 'pixi.js';
import * as PIXI_CANVAS from 'pixi.js-legacy';


//

const createGameWebGL = () => new PIXI.Application({
    width: window.innerWidth-20,
    height: window.innerHeight-20,
    backgroundColor: 0x66ccff
});

//  
const createGameCanvas = () => new PIXI_CANVAS.Application({
    width: window.innerWidth-100,
    height: window.innerHeight-100,
    backgroundColor: 0x66ccff
});



const randomInt = (min:number, max:number):number => Math.floor(min + Math.random() * (max + 1 - min));


let game:PIXI.Application;

/*
    Проверка браузера на совместимость с WebGL, если нет то использовать Canvas
*/

PIXI.utils.isWebGLSupported() ? game = createGameWebGL() : game = createGameCanvas();


/*
    Массив используемых цветов
*/

type colorMatrixConfig = number;
const colorMatrix:colorMatrixConfig[] = [0xff0000, 0x00ff00, 0xff00ff, 0xcccc00, 0x009933, 0xb300b3, 0x4287f5];


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
    
    private _activeSpriteArray:any = []; // буфер, содержит активные объекты
    private _collisionSquares:any = []; // буфер, содержит одинаковые "соседние" объекты
    private _score:number = 0; //  

    constructor() {
        super();
        this.width = 800;
        this.height = 800;
        this.position.x = 100;
        this.position.y = 100;
        this._setBackground();
    }

    private _setBackground() {
        
        /*
            Метод, устанавливает фон
            TODO: возможно есть решение по-лучше, но пока так. 
        */
        this.addChild(this._gameSceneBackground);
    }

    public startGame():void { 
       
        /*
            Фунция заполнения доски, при старте игры.
        */

        for (let row = 50; row < 800; row+=100) { // строки
            for (let col = 50; col < 800;) {    // столбцы
                const sprite = new square(row, col , colorMatrix[randomInt(0,6)]);
                sprite.on("click",this._onChangePosition, this);           
                
                /*
                    Так как функция рандомного выбора цвета работает не идеально, 
                    чтобы не допустисть на старте игры нескольких одинаковых обьекта
                    рядом, делаю проверку его соседей, и если цвета не совпадают - то 
                    объект добавляется.
                */

                if (!this._checkSameObjects(sprite)) { 
                        this.addChild(sprite); 
                        col+=100;                        
                    } 
              }
        }
    }
    public playGame():void {
        
        for (let row = 50; row < 800; row+=100) {

            if ( !this.children.some((item:any) => item.x === row && item.y < 150)) {

                const sprite = new square(row, 50 , colorMatrix[randomInt(0,6)]);
                sprite.on("click",this._onChangePosition, this);

                if (!this._checkSameObjects(sprite)) {
                
                    this.addChild(sprite);
                }

            }

        }
    }

    private _checkSameObjects(object:square, defaultObject:PIXI.DisplayObject[] = this.children):boolean {
        return defaultObject.some((item:any) =>
                item.tint === object.tint && // цвет 
                ((item.y === object.y && Math.abs(item.x - object.x) === item.width) || 
                (item.x === object.x && Math.abs(item.y - object.y) === item.height)));
    }

    private _moveSquare(object1:square, object2:square):void {

        /*
            Функция смены позиций выбранных объектов.
            Проверяеться "соседство".
        */

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

        /*
            Обработка нажатия клавиши на объект.
            Используеться буфер _activeSpriteArray для временного хранения активных обьектов.
            После перемещения проводим проверку на то уничтожиться обьект или нет, если отрицательно
            то возвращаем обратно.
            В дальнейшем можно добавить анимацию.
        */

        this._activeSpriteArray = [...this._activeSpriteArray, event.currentTarget];
        
        if (this._activeSpriteArray.length === 2) {   
            
            this._moveSquare(this._activeSpriteArray[0], this._activeSpriteArray[1]);

            if (!this._checkSameObjects(this._activeSpriteArray[0]) && !this._checkSameObjects(this._activeSpriteArray[1])) {
                  this._moveSquare(this._activeSpriteArray[0], this._activeSpriteArray[1]);  
            }
            
            this._activeSpriteArray = [];
           
        }
        
    }

    private _checkCollisionSquares(object1:square, object2:square):boolean {
        
        /*
            Медод для проверки "соседства"
        */
        return object1.tint === object2.tint && (object1.position.y === object2.position.y &&
               Math.abs(object1.position.x - object2.position.x) === object1.width ||
               object1.position.x === object2.position.x && Math.abs(object1.position.y - object2.position.y) === object2.height);
    }

    public get score():number {
        return this._score;
    }

    public setCollisionSquares():void {
        
        /*
            Метод добавляет одинаковые "соседние" объекты в буфер _collisionSquares.
        */
        this._collisionSquares = this.children.filter((item:any) => this.children.some((item2:any) => this._checkCollisionSquares(item, item2)));
    }


    public destroySquares():void {
        /*
            Метод обходит буфер _collisionSquares и "уничтожает" обьекты
        */       

        this._collisionSquares
            .map((item:any) => [item, ...this._collisionSquares.filter((object:any) => this._checkCollisionSquares(object, item))])
            .forEach((item:any) => {
                                if (item.length > 2) {
                                    this._score += item.length;
                                    item.forEach((object:any) => this.removeChild(object));  
                                }                
                        });    
    }

    public checkNextSquareByY(object:square) {
        
        /*
            Метод определяющий наличе "соседа" снизу
        */
        return this.children.some((item:any) => item.x === object.x && (item.y - object.y) === object.height);
    }
}

class info extends PIXI.Container {

    private _infoBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 300, 300).endFill();
    private _title:PIXI.Text = new PIXI.Text(`Info`,{fontFamily : 'Arial', fontSize: 42, fill : 0xffffff});
    private _scoreInfo:PIXI.Text = new PIXI.Text("Score:",{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});

    constructor(score:any) {
        super();
        this.x = 1000;
        this.y = 100;
        this.height = 300;
        this.width = 300;
        this._setBackground();

        
        this._setTitle();
        this._title.x = this.width/2 - this._title.width/2 ;
        this._title.y = 50;

        // Инициализация блока показа очков (количество уничтоженых объектов)

        this.addChild(this._scoreInfo);
        this._scoreInfo.x = this.width/2 - this._scoreInfo.width/2;
        this._scoreInfo.y = this._title.y + 100;


    }

    private _setBackground() {
        
        this.addChild(this._infoBackground);
    }
    private _setTitle() {
        this.addChild(this._title);
    }

    public set scoreInfo(score:any) {
        this._scoreInfo.text = "Score: " + score.toString();
   }
}

const moving = () => {
    gameScene.setCollisionSquares();
    
    gameScene.destroySquares();
    gameScene.playGame();
    
    gameScene.children.slice(1).forEach((item:any) => {

        /*
            Приводим объекты в движение. 
            Проверяем нижнюю границу и "соседство снизу"
        */

        if (((item.position.y + item.height/2) < gameScene.height) && !gameScene.checkNextSquareByY(item)) {     
            item.position.y +=1;            
        }
    }
    );

    infoScene.scoreInfo = gameScene.score;
   
}

const gameScene = new board;
const infoScene = new info(gameScene.score);

game.ticker.add(moving);
//game.ticker.maxFPS = 0.5;
game.stage.addChild(gameScene);
game.stage.addChild(infoScene);
gameScene.startGame();



console.log(gameScene);


