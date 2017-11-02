/**
 * Окно выбора действий для уже имеющегося ресурса во время его загрузки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
Ext.define(
    'FBEditor.resource.replacer.Window',
    {
        extend: 'Ext.Panel',
        requires: [
            'FBEditor.resource.replacer.button.cancel.Cancel',
            'FBEditor.resource.replacer.button.rename.Rename',
            'FBEditor.resource.replacer.button.replace.Replace'
        ],

        floating: true,
        modal: true,
        bodyPadding: 10,
        closeAction: 'hide',
        closable: true,
        defaultFocus: 'resource-replacer-button-replace',

        defaults: {
            width: '100%',
            margin: '5 0 0 0'
        },

        translateText: {
            choose: 'Выберите действие',
            title: 'Ресурс с именем {name} уже существует'
        },

        /**
         * @private
         * @property {Object} Данные ресурса.
         */
        resData: null,

        /**
         * @private
         * @property {FBEditor.resource.replacer.button.rename.Rename} Кнопка замены имени ресурса.
         */
        renameButton: null,

        /**
         * @private
         * @property {FBEditor.resource.replacer.button.replace.Replace} Кнопка замены ресурса.
         */
        replaceButton: null,

        /**
         * @param {Object} resData Данные ресурса.
         */
        constructor: function (resData)
        {
            var me = this;

            me.resData = resData;

            me.callParent(arguments);
        },

        initComponent: function ()
        {
            var me = this,
                tt = me.translateText;

            me.items = [
                {
                    xtype: 'component',
                    html: tt.choose
                },
                {
                    xtype: 'resource-replacer-button-replace',
                    win: me
                },
                {
                    xtype: 'resource-replacer-button-rename',
                    win: me
                },
                {
                    xtype: 'resource-replacer-button-cancel',
                    win: me
                }
            ];

            me.callParent(arguments);
        },

        afterRender: function ()
        {
            var me = this;

            me.callParent(arguments);

            me.setResourceData(me.resData);
        },

        /**
         * Возвращает менеджер ресурсов.
         * @return {FBEditor.resource.Manager}
         */
        getResourceManager: function ()
        {
            return FBEditor.resource.Manager;
        },

        /**
         * Устанавливает данные ресурса.
         * @param {Object} resData
         */
        setResourceData: function (resData)
        {
            var me = this,
                tt = me.translateText,
                name,
                title,
                renameButton;

            me.resData = resData;

            // меняем заголовок окна
            name = resData.name;
            title = tt.title.replace('{name}', name);
            me.setTitle(title);

            // меняем текст кнопки замены
            renameButton = me.getRenameButton();
            renameButton.changeText(name);
        },

        /**
         * Возвращает данные ресурса.
         * @return {Object}
         */
        getResourceData: function ()
        {
            return this.resData;
        },

        /**
         * Возвращает кнопку замены ресурса.
         * @return {FBEditor.resource.replacer.button.replace.Replace}
         */
        getReplaceButton: function ()
        {
            var me = this,
                btn = me.replaceButton;

            btn = btn || me.down('resource-replacer-button-replace');
            me.replaceButton = btn;

            return btn;
        },

        /**
         * Возвращает кнопку замены имени ресурса.
         * @return {FBEditor.resource.replacer.button.rename.Rename}
         */
        getRenameButton: function ()
        {
            var me = this,
                btn = me.renameButton;

            btn = btn || me.down('resource-replacer-button-rename');
            me.renameButton = btn;

            return btn;
        }
    }
);