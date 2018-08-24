/**
 * Панель контента редактора xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.Content',
    {
        extend: 'Ext.Component',

        id: 'panel-xml-content',
        xtype: 'panel-xml-content',

        width: '100%',
        height: '100%',

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Xml} Редактор xml.
         */
        xmlPanel: null,

        afterRender: function ()
        {
            var me = this,
                xmlPanel = me.getXmlPanel(),
                manager,
                proxyEditor;

            manager = xmlPanel.getManager();

            // инициализиурем прокси
            proxyEditor = manager.getProxyEditor();
            proxyEditor.init(manager);

            me.callParent(arguments);
        },

        /**
         * Возвращает редактор xml.
         * @return {FBEditor.view.panel.main.xml.Xml}
         */
        getXmlPanel: function ()
        {
            var me = this,
                panel;

            panel = me.xmlPanel || me.up('main-xml');
            me.xmlPanel = panel;

            return panel;
        },

        /**
         * Возвращает узел контента редактора.
         * @return {Node}
         */
        getNode: function ()
        {
            var me = this,
                content;

            content = me.getEl().dom;

            return content;
        }
    }
);