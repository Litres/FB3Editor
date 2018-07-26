/**
 * Кнопка редактирования xml элемента пути.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.body.path.edit.Edit',
    {
        extend: 'FBEditor.view.panel.main.props.body.path.el.El',
        requires: [
            'FBEditor.view.panel.main.props.body.path.edit.EditController'
        ],

        controller: 'panel.props.body.path.edit',
        xtype: 'panel-props-body-path-edit',
        cls: 'panel-props-body-path-edit',

        constructor: function (data)
        {
            var me = this,
                focusEl = data.focusEl,
                name = focusEl.getName();

            me.callParent(arguments);

            me.html = '<span class="fa fa-pencil"></span>';
        },

        /**
         * Возвращает дерево навигации по тексту.
         * @return {FBEditor.view.panel.treenavigation.body.Tree}
         */
        getTreePanel: function ()
        {
            var me = this,
                bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext.getCmp('panel-body-navigation');

            return panel;
        },

        /**
         * Возвращает дерево навигации по xml.
         * @return {FBEditor.view.panel.treenavigation.xml.Tree}
         */
        getXmlTreePanel: function ()
        {
            var me = this,
                bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext.getCmp('panel-xml-navigation');

            return panel;
        }
    }
);