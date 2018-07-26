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
                treePanel,
                xmlTreePanel;

            // панель дерева навигации по тексту
            treePanel = view.getTreePanel();

            // снимаем выделение в дереве навигации по тексту
            treePanel.clearSelection();

            // панель дерева навигации по xml
            xmlTreePanel = view.getXmlTreePanel();

            // открываем редактирование xml элемента
            xmlTreePanel.fireEvent('openElement', el);
        }
    }
);