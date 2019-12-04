import { game } from "./components/game";


/*
    Запуск игры
*/


const myGame:game = new game;
document.body.appendChild(myGame.view);  