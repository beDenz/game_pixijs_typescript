import {square} from "./square";
import { colorMatrix, randomInt } from "../service/service";
import * as PIXI from "pixi.js";
import "pixi-sound";

export class board extends PIXI.Container {

    private _gameSceneBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 800, 800).endFill();
    
    private _activeSpriteArray:square[] = []; // буфер, содержит активные объекты
    private _collisionSquares:square[] = []; // буфер, содержит одинаковые "соседние" объекты
    private _score:number = 0;
    private _destroySound:any;

    constructor() {
        super();
        this.width = 800;
        this.height = 800;
        this.position.x = 100;
        this.position.y = 100;
        this._setBackground();

    }

    private _setBackground():void {
        
        /*
            Метод, устанавливает фон
        */
        this.addChild(this._gameSceneBackground);
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
        */

        this._activeSpriteArray = [...this._activeSpriteArray, event.currentTarget as square];
        
        if (this._activeSpriteArray.length === 2) {   
            
            this._moveSquare(this._activeSpriteArray[0], this._activeSpriteArray[1]);

            this.setCollisionSquares();   
           

            if (this._collisionSquares
                .map(item => [item, ...this._collisionSquares.filter(object =>  this._checkCollisionSquares(object, item))])
                .filter(item => item.length > 2)
                .length === 0) this._moveSquare(this._activeSpriteArray[0], this._activeSpriteArray[1]);
            
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
        this._collisionSquares = this.children.filter((item:any) => 
                                    this.children.some((item2:any) => 
                                        this._checkCollisionSquares(item, item2))
                                ) as square[];
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
                                    
                                    this._destroySound();
                                }                
                        });    
    }

    public checkNextSquareByY(object:square) {
        
        /*
            Метод определяющий наличе "соседа" снизу
        */
        return this.children.some((item:PIXI.DisplayObject) => item.x === object.x && (item.y - object.y) === object.height);
    }

    public setDestroySound(object:Function):void {
        this._destroySound = object;
    }

    public moving = ():void => {
                
        this.setCollisionSquares();        
        this.destroySquares();
        this.playGame();
        
        this.children.slice(1).forEach((item:any) => { // Первый элемент - фон, его пропускаем
    
            /*
                Приводим объекты в движение. 
                Проверяем нижнюю границу и "соседство снизу"
            */
    
            if (((item.position.y + item.height/2) < this.height) && !this.checkNextSquareByY(item)) {     
                item.position.y +=1;            
            }
        }
        );   
      
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
        
        /*
         *  Функция рандомного создания обьектов, во время игры
         *  При создании проверяються соседние объекты на совподения
         */

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
}