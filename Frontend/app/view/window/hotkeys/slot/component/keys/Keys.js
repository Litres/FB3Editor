/**
 * Компонент сочетания клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.window.hotkeys.slot.component.keys.Keys',
    {
        extend: 'Ext.Component',

        cls: 'window-hotkeys-slot-keys',

        width: 150,

        /**
         * Устанавливает текст.
         * @param {String} text
         */
        setText: function (text)
        {
            var me = this;

            text = text || '';
            me.update(text);
        }
    }
);