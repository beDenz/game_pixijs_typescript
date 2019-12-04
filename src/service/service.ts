import * as PIXI from "pixi.js";
import * as PIXI_CANVAS from 'pixi.js-legacy';
import { game } from "../components/game";

export const randomInt = (min:number, max:number):number => Math.floor(min + Math.random() * (max + 1 - min));


/*
    Массив используемых цветов
*/
type colorMatrixConfig = number;
export const colorMatrix:colorMatrixConfig[] = [0xff0000, 0x00ff00, 0xff00ff, 0xcccc00, 0x009933, 0xb300b3, 0x4287f5];


export const brouserSupport = ():any => {
    return PIXI.utils.isWebGLSupported() ? PIXI.Application : PIXI_CANVAS.Application;
}

export default function start():void {
    const myGame:game = new game;
    document.body.appendChild(myGame.view);    
}

