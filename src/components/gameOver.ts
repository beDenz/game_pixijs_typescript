import * as PIXI from "pixi.js";
//import start from "../service/service";
import start, { getTime, getTimeConfig } from "../service/service";
export class gameOver extends PIXI.Container {

    private _gameOverBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 600, 600).endFill();
    private _title:PIXI.Text = new PIXI.Text(`Game Over`,{fontFamily : 'Arial', fontSize: 42, fill : 0xffffff});
    private _scoreInfo:PIXI.Text = new PIXI.Text("Your score:",{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});
    private _timeInfo:PIXI.Text = new PIXI.Text("Your time:",{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});
    private _newGameButton:PIXI.Graphics = new PIXI.Graphics().lineStyle(2, 0xFFFFFF, 1).beginFill(0xDE3249).drawRect(0,0, 150,50).endFill();
    private _newGameButtonText:PIXI.Text = new PIXI.Text("TRY AGAIN!",{fontFamily : 'Arial', fontSize: 16, fill : 0xffffff});
    private _destroyApp:any;

    constructor() {
        super();
        this.width = 600;
        this.height = 600;
        this.x = 350;
        this.y = 150;
        this.visible = false;

        
        // Title
        this._title.x = 600/2 - this._title.width/2;
        this._title.y = 50;

        // Score
        this._scoreInfo.x = 600/2 - this._scoreInfo.width/2;
        this._scoreInfo.y = this._title.y + this._title.height + 100;

        // Time

        this._timeInfo.x = 600/2 - this._timeInfo.width/2;
        this._timeInfo.y = this._scoreInfo.y + this._scoreInfo.height + 50;
        
        // Button
        this._newGameButton.x = 600/2 - this._newGameButton.width/2;
        this._newGameButton.y = 600/2 - this._newGameButton.height + 100;
        this._newGameButton.buttonMode = true;
        this._newGameButton.interactive = true;
        this._newGameButton.on('click', this._startNewGame, this);
        // Button Text
        this._newGameButtonText.anchor.set(0.5);
        this._newGameButtonText.x = this._newGameButton.width/2;
        this._newGameButtonText.y = this._newGameButton.height/2;
        this._newGameButton.addChild(this._newGameButtonText);

        this.addChild(this._gameOverBackground, this._title, this._scoreInfo, this._timeInfo , this._newGameButton);
    }
    
    public set scoreInfo(score:number) {
        this._scoreInfo.text = "Your score: " + score.toString();
    }

    public set timeInfo(time:number) {        
        
        this._timeInfo.text = `Your time: ${Math.floor((time/1000/60) % 60)} min ${Math.floor((time/1000) % 60)} sec` ;
    }

   public setVisible():void {
       this.visible = !this.visible;
   } 

   private _startNewGame():void {
        this._destroyApp();
        start();
   }

   public set setDestroyApp(object:any) {
       this._destroyApp = object;       
   }


} 