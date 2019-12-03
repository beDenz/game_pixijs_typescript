import * as PIXI from 'pixi.js';

export class info extends PIXI.Container {

    private _infoBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 300, 300).endFill();
    private _title:PIXI.Text = new PIXI.Text(`Info`,{fontFamily : 'Arial', fontSize: 42, fill : 0xffffff});
    private _scoreInfo:PIXI.Text = new PIXI.Text("Score:",{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});

    constructor() {
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

    private _setBackground():void {
        
        this.addChild(this._infoBackground);
    }
    private _setTitle():void {
        this.addChild(this._title);
    }

    public set scoreInfo(score:number) {
        this._scoreInfo.text = "Score: " + score.toString();
   }
}