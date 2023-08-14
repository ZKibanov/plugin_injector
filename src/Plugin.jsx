import { useCallback, useRef } from 'react';

/**
* Добавляет к HTML строке - CSS ввиде строки или ссылки на внешний файл стилей (в случае, если где-то нужно размещать статику для плагина)
* в файле HTML - обязательно требуется тэг head
* @constructor
* @param {string} htmlString - минифицированный html код в виде строки
* @param {string} cssString - css в виде строки или в виде ссылки на внешний файл стилей
*/
const injectCssString = (htmlString, cssString) => {
    if (!cssString) {
        return htmlString;
    }
    // на случай, если css лежит файлом по зарезервированному адресу
    // вариант для работы со статикой, второй случай - если статики нет
    // можно расширить до массива, если нужно будет несколько js, css файлов
    const cssTag = cssString.endsWith('.css')
        ? `<link href=${cssString} rel="stylesheet" />`
        : `<style>${cssString}</style>`

    return htmlString
        .split('<head>')
        .join(`<head>${cssTag}`)
}

/**
 * Пример обработчка события, которое можно присвоить окну плагина, окружение - внутреннее для iframe, можно использовать для обработки данных из плагина.
 * @constructor
 */
const handleMouseDown = (e) => console.log('обработчик mouseDown из родительского компонента', e)

/** Компонент для отрисовки внутри iframe приходящих с бекенда HTML,CSS,JS.
 * @constructor
 * @param {string} htmlString - минифицированный HTML-код в формате строки, в файле HTML - обязательно требуется тэг <head>.
 * @param {string} style - css файл в формате строки или .css файл по внешней ссылке.
 * @param {object} wrapperStyle - стили для контейнера iFrame.
 * @param {Array} iframeVariables - массив объектов, где ключ - название переменной, а значение = значение, переменные будут в объекте window для кода, исполняемого в iframe
 * @param {string} script - минифицированный JS.
 */

const Plugin = (props) => {
    const { pluginData, iframeVariables } = props;
    const frameRef = useRef(null)

    const handleLoad = useCallback(() => {
        if (frameRef.current) {
            //-callback onload функции для скрипта
            if (pluginData.script) {
                frameRef.current.contentWindow.eval(pluginData.script);
                if (iframeVariables){
                    iframeVariables.forEach(variable => {
                        const varName = Object.keys(variable)[0]
                        frameRef.current.contentWindow[varName] = variable[varName]
                    });
                }
            }
        }
        // можно так же передавать дополнительно какие-то обработчики для iframe и получения информации из него
        const iFrame = frameRef.current?.contentDocument;
        iFrame.onmousedown = handleMouseDown;
        // iFrame.showThrobber = onShowThrobber;
        // iFrame.hideThrobber = onHideThrobber;
    }, [frameRef]);

    return <iframe
        sandbox='allow-same-origin allow-scripts allow-popups'
        ref={frameRef}
        //- если надо передавать стили как переменные или прокидывать из родительского
        style={{ ...pluginData.wrapperStyle }}
        srcDoc={injectCssString(pluginData.code, pluginData.style)}
        onLoad={handleLoad}
    />
}

export default Plugin;