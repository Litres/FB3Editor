/**
 * Команда объединения ячеек.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.JoinCellsCommand',
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
				viewportId,
				size;

			try
			{
				manager.suspendEvent = true;

				viewportId = data.opts.viewportId;

				// убираем выделение
				manager.clearSelectNodes(viewportId);

				size = data.opts.size;
				nodes.table = data.opts.table;
				els.table = nodes.table.getElement();

				els.joinTd = me.joinCells(els.table, size, viewportId);

				// синхронизируем элемент
				els.table.sync(viewportId);

				manager.suspendEvent = false;

				// курсор
				nodes.cursor = els.joinTd.nodes[viewportId];

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
				FBEditor.editor.HistoryManager.removeNext();
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
				els = data.els;

				me.splitCell(els.joinTd, viewportId);

				els.table.sync(viewportId);

				manager.suspendEvent = false;

				// курсор
				nodes.cursor = els.joinTd.nodes[viewportId];

				// устанавливаем курсор
				me.setCursor(els, nodes);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);