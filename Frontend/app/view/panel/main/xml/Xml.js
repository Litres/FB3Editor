/**
 * Редактор xml тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.xml.Xml',
    {
        extend: 'Ext.panel.Panel',
        requires: [
            'FBEditor.view.panel.main.xml.XmlController'
        ],

        id: 'main-xml',
        xtype: 'main-xml',
        controller: 'view.xml',

        listeners: {
            loadData: 'onLoadData'
        },

        layout: 'fit',

        afterRender: function ()
        {
            var me = this,
                manager = me.getManager(),
                proxyEditor;

            // инициализиурем прокси
            proxyEditor = manager.getProxyEditor();
            proxyEditor.init(me);

            me.callParent(arguments);
        },

        /**
         * Возвращает менеджер редактора xml.
         * @return {FBEditor.view.panel.main.xml.Manager}
         */
        getManager: function ()
        {
            return FBEditor.view.panel.main.xml.Manager.getInstance();
        },

        /**
         * Загружает данные в окно редактора xml.
         * @param {String} data Данные.
         */
        loadData: function (data)
        {
            var me = this,
                manager = me.getManager(),
                proxyEditor = manager.getProxyEditor();

            data = data.trim();
            proxyEditor.setData(data);
        },

        /**
         * Возвращает контент редактора.
         * @return {Node}
         */
        getContent: function ()
        {
            return this.getEl().dom.firstChild;
        }
    }
);