/**
 * Компонент с названием текущей функции сочетания клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.window.hotkeys.slot.component.title.Title',
    {
        extend: 'Ext.Component',

        /**
         * Устанавливает текст.
         * @param {String} text
         */
        setText: function (text)
        {
            var me = this;

            me.update(text);
        }
    }
);