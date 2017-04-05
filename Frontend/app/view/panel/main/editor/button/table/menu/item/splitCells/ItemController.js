/**
 * Контроллер пункта меню - Разъединить ячейки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.splitCells.ItemController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItemController',
		alias: 'controller.main.editor.button.table.menu.item.splitCells',

		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager(),
				nodes = {},
				els = {},
				range;

			range = manager.getRange();

			if (!range || !range.collapsed)
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
			els.td = els.node.isTable ? els.node : els.node.getParentName('td');

			if (!els.td || !els.td.getLinks())
			{
				view.disable();
				return false;
			}

			view.enable();

			// ссылка на ячейку для передачи в команду разъединения ячейки
			view.cmdOpts = {
				td: els.td,
				viewportId: nodes.node.viewportId
			};

			return true;
		}
	}
);