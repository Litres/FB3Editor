/**
 * Контроллер дерева навигации по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.treenavigation.xml.TreeController',
    {
        extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',

        alias: 'controller.panel.xml.navigation',

        /**
         * Вызывается при клике на одном из элементов узла дерева.
         * @param {Ext.tree.View} nodeView Узел дерева.
         * @param {Ext.data.TreeModel} record Модель узла.
         */
        onItemClick: function (nodeView, record)
        {
            var me = this;
            
            if (!nodeView.isSelected(record))
            {
	            // показываем выбранный элемент в редакторе xml
	            me.setFocusElement(record);
            }
	
	        me.callParent(arguments);
        },

        /**
         * Открывает элемент для редактирования.
         * @param {FBEditor.editor.element.AbstractElement} el Элемент.
         */
        onOpenElement: function (el)
        {
            var me = this,
                view = me.getView(),
                managerEditor = el.getManager(),
                managerXml;

            // открываем панель xml
            view.openContent();

            // загружаем данные в редактор xml
            managerXml = managerEditor.getManagerXml();
            managerXml.loadData(el);

            view.expandElement(el);
        },

        /**
         * Показывает элемент в редакторе xml.
         * @param {Ext.data.TreeModel} record Модель узла.
         */
        setFocusElement: function (record)
        {
            var me = this,
                view = me.getView(),
                data = record.getData(),
                managerEditor = FBEditor.getEditorManager(),
                promise,
                managerXml,
                el;
	
	        managerXml = managerEditor.getManagerXml();
	        //console.log('managerXml.isSyncProcess()', managerXml.isSyncProcess());
	        
	        if (!view.isActivePanel() || managerXml.isSyncProcess())
            {
                // ждем рендеринга панели или окончения процесса синхронизации xml с текстом
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

	            // проверяем и синхронизируем xml c моделью
	            promise = managerXml.sync(true);
	            
	            promise.then(
	                function (res)
                    {
                        if (res)
                        {
	                        // загружаем данные в редактор xml
	                        managerXml.loadData(el);
	                        
	                        // разворачиваем корневой узел
	                        view.expandRoot();
                        }
                    },
                    function ()
                    {
                        // reject
                    }
                );
            }
        }
    }
);