/**
 * Контроллер дерева навигации по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.treenavigation.xml.TreeController',
    {
        extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',
        requires: [
            'FBEditor.command.OpenXml'
        ],

        alias: 'controller.panel.xml.navigation',

        /**
         * Вызывается при клике на одном из элементов узла дерева.
         * @param {Ext.tree.View} nodeView Узел дерева.
         * @param {Ext.data.TreeModel} record Модель узла.
         */
        onItemClick: function (nodeView, record)
        {
            var me = this;

            me.callParent(arguments);

            // показываем выбранный элемент в редакторе xml
            me.setFocusElement(record);
        },

        /**
         * Показывает элемент в редакторе xml.
         * @param {Ext.data.TreeModel} record Модель узла.
         */
        setFocusElement: function (record)
        {
            var me = this,
                data = record.getData(),
                managerEditor = FBEditor.getEditorManager(),
                managerXml,
                el;

            if (!me.isActiveXml())
            {
                // ждем рендеринга панели
                Ext.defer(
                    function ()
                    {
                        me.setFocusElement(record);
                    },
                    200
                );
            }
            else
            {
                // получаем элемент по его id
                el = managerEditor.getElementById(data.elementId);

                // загружаем данные в редактор xml
                managerXml = managerEditor.getManagerXml();
                managerXml.loadData(el);
            }
        },

        /**
         * Открывает панель xml.
         */
        openContent: function ()
        {
            var me = this,
                cmd;

            // если панель не открыта
            if (!me.isActiveXml())
            {
                cmd = Ext.create('FBEditor.command.OpenXml');

                if (cmd.execute())
                {
                    FBEditor.HistoryCommand.add(cmd);
                }
            }
        },

        /**
         * Активна ли панель xml.
         * @return {Boolean}
         */
        isActiveXml: function ()
        {
            var bridge = FBEditor.getBridgeWindow(),
                mainContent,
                res;

            mainContent = bridge.Ext.getCmp('panel-main-content');
            res = mainContent.isActiveItem('main-xml');

            return res;
        }
    }
);