/**
 * Контроллер абстрактного слота.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.window.hotkeys.slot.AbstractSlotController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.window.hotkeys.slot',

        /**
         * @private
         * @property {Ext.window.MessageBox} Окно запроса клавиш.
         */
        alert: null,

        /**
         * @private
         * @property {Object} Нажатое сочетание клавиш.
         * @property {String} Object.key Название обычной клавиши.
         * @property {Boolean} [Object.ctrl] Зажата ли клавиша Ctrl.
         * @property {Boolean} [Object.shift] Зажата ли клавиша Shift.
         * @property {Boolean} [Object.alt] Зажата ли клавиша Alt.
         */
        data: null,

        translateText: {
            pressKeys: 'Нажмите сочетание клавиш, чтобы сменить текущее.',
            warningText: 'Данное сочетание клавиш уже существует.',
            warningTitle: 'Ошибка'
        },

        onClick: function (e)
        {
            var me = this,
                view = me.getView(),
                tt = me.translateText,
                title,
                hotkeyUtil;

            title = view.getTitleText();
            title += ' ' + view.getKeysText();

            // запрашиваем нажатие клавиш
            me.alert = Ext.Msg.alert(title, tt.pressKeys, me.alertClosed, me);

            // утилита для работы с горячими клавишами
            hotkeyUtil = FBEditor.util.Hotkey;

            // отслеживаем нажатие клавиш
            hotkeyUtil.on(
                {
                    resolve: me.hotkeyResolve,
                    scope: me
                }
            );
        },

        /**
         * @private
         * Получает данные о нажатом сочетании клавиш.
         * @param {Object} data
         * @param {String} data.key Название обычной клавиши.
         * @param {Boolean} [data.ctrl] Зажата ли клавиша Ctrl.
         * @param {Boolean} [data.shift] Зажата ли клавиша Shift.
         * @param {Boolean} [data.alt] Зажата ли клавиша Alt.
         */
        hotkeyResolve: function (data)
        {
            var me = this,
                view = me.getView(),
                alert = me.alert,
                hotkeysManager = FBEditor.hotkeys.Manager,
                title;

            //console.log('success hotkey', data);

            me.data = data;

            // формируем заголовок
            title = view.getTitleText() + ' ' + hotkeysManager.getFormatKeysText(data);

            alert.setTitle(title);
        },

        /**
         * @private
         * Вызвается после того как пользователь закроет окно запроса.
         */
        alertClosed: function (res)
        {
            var me = this,
                view = me.getView(),
                tt = me.translateText,
                OK = 'ok',
                data = me.data,
                hotkeysManager = FBEditor.hotkeys.Manager,
                numberSlot,
                hotkeyUtil;

            //console.log('hotkey closed', res);

            // утилита для работы с горячими клавишами
            hotkeyUtil = FBEditor.util.Hotkey;

            // отменяем отслеживание нажатых клавиш
            hotkeyUtil.un();

            if (res === OK && data)
            {
                numberSlot = hotkeysManager.getNumberSlot(data);

                //console.log('numberSlot', numberSlot);

                if (!numberSlot)
                {
                    // устанавливаем новое сочетание клавиш для текущей функции
                    view.setHotkey(data);
                }
                else
                {
                    Ext.Msg.show(
                        {
                            title: tt.warningTitle,
                            message: tt.warningText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        }
                    );
                }
            }

            // сбрасываем данные
            me.data = null;
            me.alert = null;
        }
    }
);