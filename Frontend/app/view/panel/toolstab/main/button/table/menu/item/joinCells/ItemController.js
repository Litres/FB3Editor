/**
 * Контроллер пункта меню - Объединить ячейки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.joinCells.ItemController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItemController',
		alias: 'controller.panel.toolstab.main.button.table.menu.item.joinCells',

		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.editor.Manager,
				nodes = {},
				els = {},
				range;

			range = manager.getRange();

			if (!range || range.collapsed)
			{
				view.disable();
				return false;
			}

			nodes.node = range.common;

			if (!nodes.node.getElement || nodes.node.getElement().isRoot)
			{
				view.disable();
				return false;
			}

			els.node = nodes.node.getElement();

			if (!els.node.hasParentName('table'))
			{
				view.disable();
				return false;
			}

			view.enable();

			return true;
		}
	}
);