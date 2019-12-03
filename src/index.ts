import * as PIXI from 'pixi.js';
import * as PIXI_CANVAS from 'pixi.js-legacy';
import { board } from "./components/board";
import { info } from "./components/info";
import { soundInterface } from "./components/soundInterface";



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

/*
 * Инициализация приложения
 */
let game:PIXI.Application;

/*
    Проверка браузера на совместимость с WebGL, если нет то использовать Canvas
*/

PIXI.utils.isWebGLSupported() ? game = createGameWebGL() : game = createGameCanvas();


document.body.appendChild(game.view);




const moving = ():void => {
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
const soundInterfaceScene:soundInterface = new soundInterface;
const gameScene:board = new board;
const infoScene:info = new info;


gameScene.setDestroySound(soundInterfaceScene.destroySound.bind(soundInterfaceScene));


game.ticker.add(moving);
//game.ticker.maxFPS = 0.5;
game.stage.addChild(gameScene, infoScene, soundInterfaceScene);

gameScene.startGame();

console.log(gameScene);


