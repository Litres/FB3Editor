/**
 * Абстрактный слот горячей клавиши.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.window.hotkeys.slot.AbstractSlot',
    {
        extend: 'Ext.Container',
        requires: [
            'FBEditor.view.window.hotkeys.slot.AbstractSlotController',
            'FBEditor.view.window.hotkeys.slot.component.keys.Keys',
            'FBEditor.view.window.hotkeys.slot.component.title.Title'
        ],

        controller: 'window.hotkeys.slot',

        cls: 'window-hotkeys-slot',

        listeners: {
            click: {
                element: 'el',
                fn: 'onClick'
            }
        },

        layout: 'hbox',
        margin: '0 5',

        /**
         * @property {Number} Номер слота.
         */
        numberSlot: null,

        /**
         * @protected
         * @property {String} Текст компонента с названием текущей функции.
         */
        titleText: '',

        /**
         * @protected
         * @property {Object} Сочетание клави по умолчанию.
         */
        defaultKeys: null,

        /**
         * @private
         * @property {String} Текст компонента с названием сочетания клавиш.
         */
        keysText: '',

        /**
         * @private
         * @property {FBEditor.view.window.hotkeys.Hotkeys} Окно редактора горячих клавиш.
         */
        hotkeysWin: null,

        /**
         * @private
         * @property {FBEditor.view.window.hotkeys.slot.component.keys.Keys} Компонент сочетания клавиш.
         */
        keysCmp: null,

        /**
         * @private
         * @property {FBEditor.view.window.hotkeys.slot.component.title.Title} Название текущей функции сочетания клавиш.
         */
        titleCmp: null,

        initComponent: function ()
        {
            var me = this,
                numberSlot = me.getNumberSlot(),
                hotkeysManager = FBEditor.hotkeys.Manager,
                record,
                data;

            // получаем данные из хранилища
            record = hotkeysManager.getSlot(numberSlot);
            data = record.getData();

            // устанавливаем данные текущего слота
            me.setKeysText(data);

            me.callParent(arguments);
        },

        afterRender: function ()
        {
            var me = this,
                slot,
                keys,
                title,
                keysText,
                titleText;

            keys = me.getKeysCmp();
            keysText = me.getKeysText();
            keys.setText(keysText);

            title = me.getTitleCmp();
            titleText = me.getTitleText();
            title.setText(titleText);

            slot = [
                keys,
                title
            ];

            me.add(slot);

            me.callParent(arguments);
        },

        /**
         * Возвращает номер слота.
         * @return {Number}
         */
        getNumberSlot: function ()
        {
            return this.numberSlot;
        },

        /**
         * Возвращает родительское окно редактора горячих клавиш.
         * @return {FBEditor.view.window.hotkeys.Hotkeys}
         */
        getHotkeysWindow: function ()
        {
            var me = this,
                win;

            win = me.hotkeysWin || Ext.getCmp('window-hotkeys');
            me.hotkeysWin = win;

            return win;
        },

        /**
         * Возвращает название сочетания клавиш.
         * @return {String}
         */
        getKeysText: function ()
        {
            return this.keysText;
        },

        /**
         * Возвращает название текущей функции сочетания клавиш.
         * @return {String}
         */
        getTitleText: function ()
        {
            return this.titleText;
        },

        /**
         * Устанавливает название сочетания клавиш.
         * @param {Object} data Данные сочетания клавиш.
         * @param {String} data.key
         * @param {Boolean} [data.ctrl]
         * @param {Boolean} [data.alt]
         * @param {Boolean} [data.shift]
         */
        setKeysText: function (data)
        {
            var me = this,
                hotkeysManager = FBEditor.hotkeys.Manager;

            me.keysText = hotkeysManager.getFormatKeysText(data);
        },

        /**
         * Возвращает компонент сочетания клавиш.
         * @return {FBEditor.view.window.hotkeys.slot.component.keys.Keys}
         */
        getKeysCmp: function ()
        {
            var me = this,
                keys;

            keys = me.keysCmp || Ext.create('FBEditor.view.window.hotkeys.slot.component.keys.Keys');
            me.keysCmp = keys;

            return keys;
        },

        /**
         * Вовзращает компонент с названием текущей функции сочетания клавиш.
         * @return {FBEditor.view.window.hotkeys.slot.component.title.Title}
         */
        getTitleCmp: function ()
        {
            var me = this,
                title;

            title = me.titleCmp || Ext.create('FBEditor.view.window.hotkeys.slot.component.title.Title');
            me.titleCmp = title;

            return title;
        },

        /**
         * @protected
         * Устанавливает новое сочетание клавиш для текущей функции.
         * @param {Object} data Данные сочетания клавиш.
         * @param {String} data.key Название обычной клавиши.
         * @param {Boolean} [data.ctrl] Зажата ли клавиша Ctrl.
         * @param {Boolean} [data.shift] Зажата ли клавиша Shift.
         * @param {Boolean} [data.alt] Зажата ли клавиша Alt.
         */
        setHotkey: function (data)
        {
            var me = this,
                keysCmp = me.getKeysCmp(),
                hotkeysManager = FBEditor.hotkeys.Manager,
                numberSlot = me.getNumberSlot(),
                text;

            // обновляем текст слота
            text = hotkeysManager.getFormatKeysText(data);
            keysCmp.setText(text);
            me.setKeysText(data);

            // устанавливаем новые данные для слота
            data.slot = numberSlot;
            hotkeysManager.updateSlotData(data);
        }
    }
);