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

		},

		/**
		 * Вызывается при двойном клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemDblClick: function (node, record)
		{

		},

		/**
		 * Вызывается перед кликом по одному из узлов дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onBeforeItemClick: function (node, record)
		{
			var me = this;

			me.clearSelection();
			if (me.openContent)
			{
				// открываем соответствующую панель контента
				me.openContent();
			}
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