const fs = require('fs')
const jsesc = require('jsesc');

/*
* Консольная утилита для конвертации скрипта в строку
* Запуск - из папки demo-server node converter.js
* Требования - файл bundle.js в той же папке
* Html - берется типовой и захардкожен в утилите строкой
* Результат - файл data.json, готовый для демонстрации работы плагина
*/

const htmlString = '{"httml": {"code": "<!doctype html><html lang=\\"en\\"><head><meta charset=\\"UTF-8\\"><meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\"><title>Document</title></head><body><div id=\\"root\\"></div></body></html>","wrapperStyle": {       \"width\": "300px",        \"height\": "550px","backgroundColor": "tomato"},'
const jsBuffer = fs.readFileSync("bundle.js");

fs.writeFile('./data.json',
    htmlString
    + `"script":"${jsesc(jsBuffer.toString(), {
        'quotes': 'double'
    })}"`
    + '}}', () => {
        console.log('file converted')
    });
