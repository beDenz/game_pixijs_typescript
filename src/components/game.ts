import * as PIXI from "pixi.js";
import * as PIXI_CANVAS from 'pixi.js-legacy';
import { board } from "./board";
import { info } from "./info";
import { soundInterface } from "./soundInterface";
import { gameOver } from "./gameOver";
import { brouserSupport } from "../service/service";

interface appOptionsConfig {
    width: number;
    height:number;
    backgroundColor: number;
}
interface getTimeConfig {
    total: number;
    seconds: number;
    minutes: number;
}

const appOptions:appOptionsConfig = {
    width: window.innerWidth-20,
    height: window.innerHeight-20,
    backgroundColor: 0x66ccff
}

export class game extends brouserSupport() {
    
    public soundInterfaceScene:soundInterface;
    public gameScene:board;
    public infoScene:info;
    public gameOverScene:gameOver;

    private _timeInfo:getTimeConfig = {total: 0, minutes:0, seconds:0};
   
    constructor() {
        super(appOptions);

        this.soundInterfaceScene = new soundInterface;
        this.gameScene = new board;
        this.infoScene = new info;
        this.gameOverScene = new gameOver;

        this.stage.addChild(this.gameScene, this.infoScene, this.soundInterfaceScene, this.gameOverScene);

        this.ticker.add(()=> {
            this.gameScene.moving();
            this.infoScene.scoreInfo = this.gameScene.score;
            this.gameOverScene.scoreInfo = this.gameScene.score;
            this.infoScene.timer = this._timeInfo;        
        });

        this.gameOverScene.setDestroyApp = this.destroyGame.bind(this);
        this.gameScene.setDestroySound(this.soundInterfaceScene.destroySound.bind(this.soundInterfaceScene));
        this.gameScene.startGame();

        this._initClock(30000);
    }

    public destroyGame():void {
      
        this.soundInterfaceScene.stopMusic();            
        this.destroy(true);
        PIXI.Loader.shared.resources = {};
        //PIXI.Loader.shared.destroy(); // Почему то не срабатывает метод уничтожения стейта
        PIXI.utils.destroyTextureCache();
        console.log(PIXI.Loader.shared);
        //game = null;
    }

    private _getTime(time:Date):getTimeConfig {

        const total:number = Date.parse(`${time}`) - Date.parse(`${new Date()}`);

        let seconds:number = Math.floor((total/1000) % 60);
        let minutes:number = Math.floor((total/1000/60) % 60);

        return {total, seconds, minutes}
    }

    private _initClock(time:number):void {
        const endTime:Date = new Date(Date.parse(`${new Date}`) + time);

        let clockInterval:NodeJS.Timer = setInterval(() => this._updateClock(endTime, clockInterval), 1000);
    }

    private _updateClock(time:Date, clockInterval:NodeJS.Timer):void { 
              
                this._timeInfo = this._getTime(time);
            
                if (this._timeInfo.total <= 0) {
                    clearInterval(clockInterval);
                    this.gameOverScene.setVisible();              
                };
            } 
}