/**
 * Абстрактный контроллер для деревьев навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.AbstractTreeController',
	{
		extend: 'Ext.app.ViewController',

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				view = me.getView();

			//console.log('onItemClick', arguments);
			me.clearSelection();

			if (view.openContent)
			{
				if (!view.inWindow)
				{
					// открываем соответствующую панель контента
                    view.openContent();
				}

				Ext.getCmp('panel-treenavigation').saveSelectData({view: me.getView(), node: node, record: record});
				Ext.getCmp('panel-treenavigation').restoreSelectData();
			}
		},

		/**
		 * Вызывается при двойном клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemDblClick: function (node, record)
		{
			//console.log('onItemDblClick', arguments);
		},

		/**
		 * Вызывается перед кликом по одному из узлов дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onBeforeItemClick: function (node, record)
		{
			var me = this;

			//Ext.getCmp('panel-treenavigation').saveSelectData({view: me.getView(), node: node, record: record});
			//console.log('onBeforeItemClick', arguments);
			node.deselect(record, false);
			Ext.getCmp('panel-treenavigation').restoreSelectData();
		},
		
		/**
		 * Вызывает контекстное меню.
		 */
		onItemContextMenu: function (node, record, item, index, e)
		{
			e.preventDefault();
		},

		onSelect: function ()
		{
			//console.log('onSelect', arguments);
		},

		onSelectionChange: function ()
		{
			//
		},

		/**
		 * Снимает выделение со всех деревьев.
		 */
		clearSelection: function ()
		{
			var me = this,
				view = me.getView(),
				ownerCt = view.ownerCt;

			ownerCt.fireEvent('clearSelection', view);
		}
	}
);