import * as PIXI from "pixi.js";
import "pixi-sound";

export class soundInterface extends PIXI.Container {

    private _soundInterfaceBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 200, 100).endFill();
    private _title:PIXI.Text = new PIXI.Text(`Sound Interface`,{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});

    private _res:PIXI.Loader =  PIXI.Loader.shared;

    constructor() {
        super();
        this.width = 200;
        this.height = 100;
        
        this.x = 1000;
        this.y = 500;
        this.addChild(this._soundInterfaceBackground, this._title);
        this._title.x = this.width/2 - this._title.width/2;

        this._res.add(`mainTheme`, `src/assets/sound/main_theme.mp3`)
                 .add(`destroy`, `src/assets/sound/destroy.mp3`)
                 .add(`pause`,`src/assets/pause_button.png`)
                 .add(`play`,`src/assets/play_button.png`)
                 .on( 'complete', this.playMusic, this);
                 this._res.load((load, res) => 
                 {                     
                     if (res.play) {
                        const play:PIXI.Sprite = new PIXI.Sprite(res.play.texture);
                        play.x = this.width/2 - 50;
                        play.y = this._title.height+35;
                        play.anchor.set(0.5);
                        play.width = 50;
                        play.height = 50;
                        play.interactive = true;                      
                        play.on('click',this.playMusic, this);
                        this.addChild(play);
                     }
                     if (res.pause) {
                        const pause:PIXI.Sprite = new PIXI.Sprite(res.pause.texture);
                        pause.x = this.width/2 + 50;
                        pause.y = this._title.height+35;
                        pause.anchor.set(0.5);
                        pause.width = 50;
                        pause.height = 50;
                        //pause.x = 1.5*pause.width;
                        pause.interactive = true;
                        pause.on('click', this.stopMusic,this);
                        this.addChild(pause);                        
                     }
                 });
    //console.log(this._res);

    }

    public stopMusic():void {
        this._res.resources.mainTheme.sound.stop();
    }

    public playMusic():void {        
        this._res.resources.mainTheme.sound.play();
        this._res.resources.mainTheme.sound.loop = true;
        this._res.resources.mainTheme.sound.volume = 0.5;   
        }
 
    public destroySound():void {
        this._res.resources.destroy.sound.play();
    }

}