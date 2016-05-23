/**
 * Команда разъединения ячейки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.SplitCellsCommand',
	{
		extend: 'FBEditor.editor.command.table.AbstractCellCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				viewportId = data.opts.viewportId;

				els.td = data.opts.td;
				els.table = els.td.getParentName('table');

				me.splitCell(els.td, viewportId);

				// синхронизируем элемент
				els.table.sync(viewportId);

				manager.suspendEvent = false;

				// курсор
				nodes.cursor = els.td.nodes[viewportId];

				// устанавливаем курсор
				me.setCursor(els, nodes);

				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.table);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				viewportId = data.opts.viewportId;
				nodes = data.nodes;
				els = data.els;

				els.joinTd = me.joinCells(els.table, els.td._sizeSelection, viewportId);

				els.table.sync(viewportId);

				// курсор
				nodes.cursor = els.joinTd.nodes[viewportId];

				// устанавливаем курсор
				me.setCursor(els, nodes);

				manager.suspendEvent = false;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			return res;
		}
	}
);