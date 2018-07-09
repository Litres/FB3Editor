/**
 * Контроллер дерева навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.TreeNavigationController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.treenavigation',

		/**
		 * Снимает выделение со всех деревьев.
		 * @param {FBEditor.view.panel.treenavigation.AbstractTree} exceptItem Дерево, с которого не снимается
		 * выделение.
		 */
		onClearSelection: function (exceptItem)
		{
			var me = this,
				view = me.getView(),
				items = view.items,
				exceptId = exceptItem.id;

			items.each(
				function (item)
				{
					if (item.id !== exceptId && item.clearSelection)
					{
						item.clearSelection();
					}
				}
			);
		}
	}
);