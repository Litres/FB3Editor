/**
 * Кнотроллер кнопки редактирования xml элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.body.path.edit.EditController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.props.body.path.edit',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
                el = view.getFocusEl(),
                treePanel;

            // панель дерева навигации по xml
            treePanel = view.getTreePanel();

            // открываем редактирование xml элемента
            treePanel.fireEvent('openElement', el);
        }
    }
);