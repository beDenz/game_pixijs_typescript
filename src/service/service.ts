export const randomInt = (min:number, max:number):number => Math.floor(min + Math.random() * (max + 1 - min));


/*
    Массив используемых цветов
*/
type colorMatrixConfig = number;
export const colorMatrix:colorMatrixConfig[] = [0xff0000, 0x00ff00, 0xff00ff, 0xcccc00, 0x009933, 0xb300b3, 0x4287f5];