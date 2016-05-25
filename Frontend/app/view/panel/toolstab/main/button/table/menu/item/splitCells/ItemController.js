/**
 * Контроллер пункта меню - Разъединить ячейки.
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
				manager = FBEditor.getEditorManager(),
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
			els.table = els.node.isTable ? els.node : els.node.getParentName('table');

			if (!els.table || !els.table.getSelection().isActive())
			{
				// выеделение неактивно
				view.disable();

				return false;
			}

			view.enable();

			// ссылка на таблицу для передачи в команду объединения ячеек
			view.cmdOpts = {
				table: els.table.nodes[nodes.node.viewportId],
				viewportId: nodes.node.viewportId,
				size: els.table.getSelection().getSize()
			};

			return true;
		}
	}
);