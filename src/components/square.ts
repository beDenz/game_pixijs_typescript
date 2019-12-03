import * as PIXI from 'pixi.js';

export class square extends PIXI.Sprite {

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