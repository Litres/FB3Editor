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
            'FBEditor.view.panel.main.xml.search.Search',
            'FBEditor.view.panel.main.xml.Content',
            'FBEditor.view.panel.main.xml.XmlController'
        ],

        id: 'main-xml',
        xtype: 'main-xml',
        controller: 'view.xml',

        listeners: {
            loadData: 'onLoadData'
        },

        layout: 'vbox',

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Content} Панель контента редактора xml.
         */
        contentPanel: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.search.Search} Панель поиска.
         */
        searchPanel: null,

        initComponent: function ()
        {
            var me = this;

            me.items = [
                {
                    xtype: 'panel-xml-search',
                    hidden: true
                },
                {
                    xtype: 'panel-xml-content',
                    flex: 1
                }
            ];

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
                proxyEditor = manager.getProxyEditor(),
                xml;

            //console.log('data', data);
            data = data.trim();
            proxyEditor.setData(data);

            // сохраняем исходный xml
            xml = proxyEditor.getData();
            manager.setSrcXml(xml);
        },

        /**
         * Возвращает узел контента редактора.
         * @return {Node}
         */
        getNode: function ()
        {
            var me = this,
                contentPanel = me.getContentPanel(),
                node;

            node = contentPanel.getNode();

            return node;
        },

        /**
         * Возвращает панель контента.
         * @return {FBEditor.view.panel.main.xml.Content}
         */
        getContentPanel: function ()
        {
            var me = this,
                panel;

            panel = me.contentPanel || me.down('panel-xml-content');
            me.contentPanel = panel;

            return panel;
        },

        /**
         * Возвращает панель поиска.
         * @return {FBEditor.view.panel.main.xml.search.Search}
         */
        getSearchPanel: function ()
        {
            var me = this,
                panel;

            panel = me.searchPanel || me.down('panel-xml-search');
            me.searchPanel = panel;

            return panel;
        }
    }
);