import * as PIXI from "pixi.js";
import "pixi-sound";

export class soundInterface extends PIXI.Container {

    private _soundInterfaceBackground:PIXI.Graphics = new PIXI.Graphics().beginFill(0x383535).drawRect(0,0, 200, 100).endFill();
    private _title:PIXI.Text = new PIXI.Text(`Sound Interface`,{fontFamily : 'Arial', fontSize: 22, fill : 0xffffff});

    constructor() {
        super();
        this.width = 200;
        this.height = 100;
        
        this.x = 1000;
        this.y = 500;
        this.addChild(this._soundInterfaceBackground, this._title);
        this._title.x = this.width/2 - this._title.width/2;

        PIXI.Loader.shared.add(`mainTheme`, `src/assets/sound/main_theme.mp3`)
                 .add(`destroy`, `src/assets/sound/destroy.mp3`)
                 .add(`pause`,`src/assets/pause_button.png`)
                 .add(`play`,`src/assets/play_button.png`)
                 .add(`mute`,`src/assets/mute_button.png`)
                 .on( 'complete', this.playMusic, this)
                 .load((load, res) => 
                 {             
                        
                     if (res.play) {
                        const play:PIXI.Sprite = new PIXI.Sprite(res.play.texture);
                        play.x = 37;
                        play.y = this._title.height+35;
                        play.anchor.set(0.5);
                        play.width = 50;
                        play.height = 50;
                        play.interactive = true;
                        play.buttonMode = true;                      
                        play.on('click',this.playMusic, this);
                        this.addChild(play);
                     }
                     if (res.pause) {
                        const pause:PIXI.Sprite = new PIXI.Sprite(res.pause.texture);
                        pause.x = 100;
                        pause.y = this._title.height+35;
                        pause.anchor.set(0.5);
                        pause.width = 50;
                        pause.height = 50;
                        pause.buttonMode = true;
                        pause.interactive = true;
                        pause.on('click', this.stopMusic,this);
                        this.addChild(pause);                        
                     }
                     if (res.mute) {
                         
                        const mute:PIXI.Sprite = new PIXI.Sprite(res.mute.texture);
                        mute.x = 160;
                        mute.y = this._title.height+35;
                        mute.anchor.set(0.5);
                        mute.width = 50;
                        mute.height = 50;
                        mute.interactive = true;
                        mute.buttonMode = true;
                        mute.on('click', this.muteSound,this);
                        this.addChild(mute);                        
                     }
                 });    
    }

    public stopMusic():void {
        PIXI.Loader.shared.resources.mainTheme.sound.stop();
    }

    public playMusic():void {
        if (!PIXI.Loader.shared.resources.mainTheme.sound.isPlaying) {
            PIXI.Loader.shared.resources.mainTheme.sound.play();
            PIXI.Loader.shared.resources.mainTheme.sound.loop = true;
            PIXI.Loader.shared.resources.mainTheme.sound.volume = 0.5;  
        }
    }
 
    public destroySound():void {
        PIXI.Loader.shared.resources.destroy.sound.play();
    }
    public muteSound():void {
        for (let key in PIXI.Loader.shared.resources) {
            if (PIXI.Loader.shared.resources[key].sound) 
            PIXI.Loader.shared.resources[key].sound.volume === 0 ? 
                PIXI.Loader.shared.resources[key].sound.volume = 1 : 
                PIXI.Loader.shared.resources[key].sound.volume = 0;
        }

    }

}