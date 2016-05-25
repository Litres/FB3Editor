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
				manager,
				viewportId,
				size;

			try
			{
				viewportId = data.opts.viewportId;

				size = data.opts.size;
				nodes.table = data.opts.table;
				els.table = nodes.table.getElement();

				manager = els.table.getManager();
				manager.setSuspendEvent(true);

				// убираем выделение
				manager.clearSelectNodes(viewportId);

				els.joinTd = me.joinCells(els.table, size, viewportId);

				// синхронизируем элемент
				els.table.sync(viewportId);

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
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				viewportId;

			try
			{
				viewportId = data.opts.viewportId;
				els = data.els;

				manager = els.table.getManager();
				manager.setSuspendEvent(true);

				me.splitCell(els.joinTd, viewportId);

				els.table.sync(viewportId);

				// курсор
				nodes.cursor = els.joinTd.nodes[viewportId];

				// устанавливаем курсор
				me.setCursor(els, nodes);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			return res;
		}
	}
);