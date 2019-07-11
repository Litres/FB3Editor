/**
 * Дерево навигации по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.treenavigation.xml.Tree',
    {
        extend: 'FBEditor.view.panel.treenavigation.AbstractTree',
        requires: [
            'FBEditor.command.OpenXml',
            'FBEditor.view.panel.treenavigation.xml.TreeController',
            'FBEditor.view.panel.treenavigation.xml.TreeStore'
        ],

        id: 'panel-xml-navigation',
        xtype: 'panel-xml-navigation',
        controller: 'panel.xml.navigation',

        listeners: {
            openElement: 'onOpenElement'
        },

        stateId: 'panel-xml-navigation',
        stateful: true,
        useArrows: true,
        animate: false,

        selModel: {
            // предотвращаем перенос фокуса
            preventFocus: true
        },

        syncContentId: 'main-xml',
        cmdName: 'FBEditor.command.OpenXml',

        initComponent: function ()
        {
            var me = this;

            me.store = Ext.create('FBEditor.view.panel.treenavigation.xml.TreeStore');

            me.callParent(arguments);
        },

        afterRender: function ()
        {
            var me = this,
	            bridgeWindow = FBEditor.getBridgeWindow(),
	            descManager = bridgeWindow.FBEditor.desc.Manager,
                manager,
                data;

            manager = FBEditor.getEditorManager();
            data = manager.getContent();

            if (data && (manager.isLoadUrl() || !descManager.isLoadUrl() && !manager.isLoadUrl()))
            {
                // дерево должно отображдаться только при уже загруженом тексте
                me.loadData(data);
            }

            me.callParent(arguments);
        },

        destroy: function ()
        {
            var me = this;

            // сохраняем состояние открытых узлов дерева перед уничтожением панели
            me.saveStateNodes();

            me.callParent(arguments);
        },

        /**
         * Загружает в дерево данные.
         * @param {FBEditor.editor.element.AbstractElement} data Корневой элемент тела книги.
         */
        loadData: function (data)
        {
            var me = this,
                treeData;

            me.saveStateNodes();
            treeData = me.getTreeData(data);
            me.store.loadData(treeData);
        },

        /**
         * Возвращает струткуру дерева.
         * @param {FBEditor.editor.element.AbstractElement} root Корневой элемент тела книги.
         * @return {Array} Структура дерева.
         */
        getTreeData: function (root)
        {
            var me = this,
                rootData = me.store.getRoot().data,
                treeData,
                rootTreeData;

            treeData = me.getTreeChildren(root);
            //console.log('treeData', treeData);

            rootTreeData = [
                {
                    root: true,
                    text: rootData.text,
                    expandable: rootData.expandable,
                    icon: rootData.icon,
                    cls: rootData.cls,
                    iconCls: rootData.iconCls,
                    children: treeData.children,
                    elementId: root.elementId
                }
            ];

            return rootTreeData;
        },

        /**
         * Рекурсивная функция, возвращающая данные всех потомков для дерева.
         * @param {FBEditor.editor.element.AbstractElement} el Элемент текста.
         * @param {String} parentPath Путь родителя элемента в дереве навигации.
         * @return {Array} Структура дерева потомков элемента.
         */
        getTreeChildren: function (el, parentPath)
        {
            var me = this,
                val = null,
                manager = FBEditor.getEditorManager();


            if (el.showedOnTree)
            {
                if (el.children)
                {
                    // сохраняем полный путь элемента в дереве навигации
                    parentPath = parentPath || '';
                    el.xmlTreePath = parentPath + '/' + el.elementId;
                    //console.log('tree', el.treePath);
                }

                val = {};
                val.text = el.getNameTree();
                val.elementId = el.elementId;
                val.expanded = manager.stateExpandedNodesTree[el.elementId] ? true : false;
                val.icon = ' ';
                val.cls = 'treenavigation-children treenavigation-children-xml';
                val.cls += el.cls ? ' treenavigation-children-' + el.cls : '';

                Ext.Array.each(
                    el.children,
                    function (item)
                    {
                        var child;

                        if (item.showedOnTree)
                        {
                            // отображаем элемент в дереве
                            child = me.getTreeChildren(item, el.treePath);

                            if (child)
                            {
                                val.children = val.children || [];
                                val.children.push(child);
                            }
                        }
                        else
                        {
                            // проверяем следующих вложенных потомков для отображения в дереве
                            Ext.Array.each(
                                item.children,
                                function (itemChild)
                                {
                                    child = me.getTreeChildren(itemChild, el.treePath);

                                    if (child)
                                    {
                                        val.children = val.children || [];
                                        val.children.push(child);
                                    }
                                }
                            );
                        }
                    }
                );

                val.leaf = !val.children;
            }

            return val;
        },

        /**
         * Сохраняет id открытых узлов, чтобы восстановить их при следующем обновлении данных дерева.
         * @param {Array} [data] Дочерние узлы. Если не указаны, то по умолчанию беруться дочерние узлы корневого узла.
         */
        saveStateNodes: function (data)
        {
            var me = this,
                manager = FBEditor.getEditorManager();

            data = data || me.store.getData().items[0].data.children;

            Ext.Array.each(
                data,
                function (item)
                {
                    if (item.expanded)
                    {
                        // сохраняем id открытого узла
                        manager.stateExpandedNodesTree[item.elementId] = true;
                    }
                    else if (manager.stateExpandedNodesTree[item.elementId])
                    {
                        // удаляем id закрытого узла
                        delete manager.stateExpandedNodesTree[item.elementId];
                    }

                    if (item.children && item.children.length)
                    {
                        me.saveStateNodes(item.children);
                    }
                }
            );
        },

        /**
         * Разворачивает ветку элемента в дереве навигации.
         * @param {FBEditor.editor.element.AbstractElement} el Элемент.
         */
        expandElement: function (el)
        {
            var me = this;

            if (Ext.isEmpty(el.xmlTreePath) && el.parent)
            {
                me.expandElement(el.parent);

                return;
            }

            //console.log('expandElement', el.xmlTreePath, el);
            me.selectPath(el.xmlTreePath, 'elementId');
        },
	
	    /**
         * Разворачивает корневой узел.
	     */
	    expandRoot: function ()
        {
            var me = this;
            
	        me.getView().expand(me.store.first());
        },
        
        /**
         * Устанавливает фокус на корневом узле дерева навигации по тексту.
         */
        selectRoot: function ()
        {
            var me = this,
                root = me.getRootNode(),
                path;

            path = '/' + root.id;
            //console.log(path);
            me.selectPath(path);
        },

        /**
         * Переписывает стандартный метод, возвращающий корневой узел (необходимо для метода #selectPath).
         * @return {Ext.data.TreeModel} Корневой узел.
         */
        getRootNode: function ()
        {
            var me = this,
                store= me.store,
                root;

            root = store && store.first() ? store.first() : me.callParent();

            return root;
        }
    }
);