/**
 * Контроллер пункта меню - Объединить ячейки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.joinCells.ItemController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItemController',
		alias: 'controller.main.editor.button.table.menu.item.joinCells',

		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager(),
				nodes = {},
				els = {},
				viewportId,
				selection,
				size,
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

			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.table = els.node.isTable ? els.node : els.node.getParentName('table');

			if (els.table)
			{
				selection = els.table.getSelection(viewportId);
				size = selection.getSize();
			}

			if (!size)
			{
				// выеделение неактивно
				view.disable();
				return false;
			}

			view.enable();

			// ссылка на таблицу для передачи в команду объединения ячеек
			view.cmdOpts = {
				table: els.table,
				viewportId: viewportId,
				size: size
			};

			return true;
		}
	}
);