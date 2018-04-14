/**
 * Утилита для работы с горячими клавишами.
 * Отслеживает сочетание управляющих клавиш CTRL|SHIFT|ALT и обычной клавиши.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.util.Hotkey',
    {
        singleton: true,

        /**
         * @private
         * @property {Object} Обработчик события.
         */
        listeners: null,

        /**
         * Отслеживает сочетание нажатых клавиш.
         * @param {Object} data
         * @param {Function} data.resolve Функция, которая вызывается при нажатии корректного сочетания клавиш.
         * @param {Object} data.scope Объект-хозяин функции resolve.
         */
        on: function (data)
        {
            var me = this,
                body;

            // документ
            body = Ext.getBody();

            // привязываем обработчик события нажатия клавиши к документу
            me.listeners = body.on(
                {
                    keydown: me.key,
                    scope: me,
                    destroyable: true,
                    args: [data]
                }
            );
        },

        /**
         * Отменяет отслеживание нажатых клавиш.
         */
        un: function ()
        {
            var me = this,
                listeners = me.listeners;

            listeners.destroy();
        },

        /**
         * @private
         * Обрабатывает событие нажатия клавиши.
         * @param {Object} data
         * @param {Function} data.resolve Функция, которая вызывается при нажатии корректного сочетания клавиш.
         * @param {Object} data.scope Объект-хозяин функции resolve.
         * @param {Ext.event.Event} e Событие.
         */
        key: function (data, e)
        {
            var me = this,
                res;

            if (!e.isSpecialKey() && (e.ctrlKey || e.shiftKey || e.altKey))
            {
                e.preventDefault();

                // данные нажатого сочетания клавиш
                res = {
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    alt: e.altKey,
                    key: e.event.key.toUpperCase()
                };

                // возвращаем результат
                data.resolve.call(data.scope, res);
            }
        }
    }
);