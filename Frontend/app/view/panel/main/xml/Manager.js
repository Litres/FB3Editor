/**
 * Менеджер редактора xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.xml.Manager',
    {
        requires: [
            'FBEditor.view.panel.main.xml.proxy.Editor'
        ],

        statics: {
            /**
             * Возвращает менеджер.
             * @property {FBEditor.view.panel.main.xml.Manager}
             */
            getInstance: function ()
            {
                return FBEditor.view.panel.main.xml.Manager.self;
            },

            /**
             * @private
             * @property {FBEditor.view.panel.main.xml.Manager}
             */
            self: null
        },

        /**
         * @private
         * @property {FBEditor.view.panel.main.editor.Manager} Менеджер редактора текста.
         */
        managerEditor: null,

        proxyEditor: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Xml} Панель редактора xml.
         */
        panel: null,

        /**
         * @param {FBEditor.view.panel.main.editor.Editor} managerEditor Менеджер редактора текста.
         */
        constructor: function (managerEditor)
        {
            var me = this;

            // сохраняем ссылку в статической переменной для последующего обращения к менеджеру через #getInstance
            FBEditor.view.panel.main.xml.Manager.self = me;

            me.managerEditor = managerEditor;

            // прокси для работы со сторонним редактором xml
            me.proxyEditor = Ext.create('FBEditor.view.panel.main.xml.proxy.Editor');
        },

        /**
         * Возврщает менеджер редактора текста.
         * @return {FBEditor.view.panel.main.editor.Manager}
         */
        getManagerEditor: function ()
        {
            return this.managerEditor;
        },

        getProxyEditor: function ()
        {
            return this.proxyEditor;
        },

        /**
         * Загружает данные в редактор xml.
         * @param {FBEditor.editor.element.AbstractElement} [el] Элемент.
         */
        loadData: function (el)
        {
            var me = this,
                managerEditor = me.getManagerEditor(),
                content = managerEditor.getContent(),
                panel = me.getPanel(),
                data;

            el = el || content;

            // получаем xml
            data = el.getXml();

            //console.log('data', data);

            // загружаем в панель
            panel.fireEvent('loadData', data);
        },

        /**
         * Обновляет дерево навигации по xml.
         */
        updateTree: function ()
        {
            var me = this,
                managerEditor = me.getManagerEditor(),
                data = managerEditor.getContent(),
                panel = me.getPanelNavigation();

            panel.loadData(data);
        },

        /**
         * Возвращает панель редактора xml.
         * @return {FBEditor.view.panel.main.xml.Xml}
         */
        getPanel: function ()
        {
            var me = this;

            me.panel = me.panel || Ext.getCmp('main-xml');

            return me.panel;
        },

        /**
         * Возвращает дерево навигации.
         * @return {FBEditor.view.panel.treenavigation.xml.Tree}
         */
        getPanelNavigation: function ()
        {
            var me = this,
                bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-xml-navigation') ?
                bridge.Ext.getCmp('panel-xml-navigation') : null;

            return panel;
        }
    }
);