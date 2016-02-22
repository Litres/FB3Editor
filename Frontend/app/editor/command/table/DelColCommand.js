/**
 * Команда удаления столбца.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.DelColCommand',
	{
		extend: 'FBEditor.editor.command.DeleteCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				range,
				res;

			nodes.node = data.node;
			els.node = nodes.node.getElement();

			range = data.range || manager.getRange();
			data.range = range;

			// ищем позицию столбца
			while (!els.node.isTd)
			{
				nodes.node = nodes.node.parentNode;
				els.node = nodes.node.getElement();
				els.pos = els.node.parent.getChildPosition(els.node);
				nodes.table = nodes.node.parentNode.parentNode;
				els.table = nodes.table.getElement();

				if (!nodes.table.parentNode)
				{
					// если ссылка на элемент была потеряна в результате многократного использования ctrl+z,
					// то пытаемся восстановить ссылку из текущего выделения
					range = manager.getRange();
					data.range = range;
					nodes.node = data.range.start;
					els.node = nodes.node.getElement();
					data.node = nodes.node;
				}
			}

			if (els.node.parent.children.length === 1)
			{
				// удаляем таблицу, если в ней только один столбец
				data.el = els.table;
				res = me.callParent(arguments);
			}
			else
			{
				try
				{
					manager.suspendEvent = true;

					data.viewportId = range.start.viewportId;
					nodes.next = nodes.node.nextSibling;
					nodes.prev = nodes.node.previousSibling;

					console.log('del col', data, range);

					// перебираем все tr и удаляем td в нужной позиции
					Ext.Array.each(
						els.table.children,
						function (tr)
						{
							els.tr = tr;
							nodes.tr = els.tr.nodes[data.viewportId];
							els.td = els.tr.children[els.pos];
							nodes.td = els.td.nodes[data.viewportId];

							els.tr.remove(els.td);
							nodes.tr.removeChild(nodes.td);
						}
					);

					// синхронизируем элемент
					els.table.sync(data.viewportId);

					manager.suspendEvent = false;

					// устанавливаем курсор
					nodes.cursor = nodes.next;
					nodes.cursor = nodes.cursor ? nodes.cursor : nodes.prev;
					nodes.cursor = nodes.cursor ? nodes.cursor : nodes.table;
					data.saveRange = {
						startNode: manager.getDeepFirst(nodes.cursor)
					};
					manager.setCursor(data.saveRange);

					// сохраняем
					data.els = els;
					data.range = range;

					// проверяем по схеме
					me.verifyElement(els.node);

					res = true;
				}
				catch (e)
				{
					Ext.log({level: 'warn', msg: e, dump: e});
					FBEditor.editor.HistoryManager.removeNext();
				}
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				res = false,
				manager = FBEditor.editor.Manager,
				range;

			if (data.el)
			{
				// восстанавливаем удаленную таблицу
				res = me.callParent(arguments);
			}
			else
			{
				console.log('Нереализована отмена удаления столбца');
				res = false;
				els = data.els;
				nodes.node = els.node.nodes[data.viewportId];
			}

			return res;
		}
	}
);