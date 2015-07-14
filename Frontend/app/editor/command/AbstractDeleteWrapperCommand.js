/**
 * Абстрактная команда удаления элемента-обёртки с сохранением всех его потомков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractDeleteWrapperCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('del wrapper ' + me.elementName, range);

				nodes.node = range.common;
				els.node = nodes.node.getElement();

				if (range.collapsed)
				{
					// без выделения

					// ищем обёртку
					while (!els.node.hisName(me.elementName))
					{
						nodes.node = nodes.node.parentNode;
						els.node = nodes.node.getElement();

						if (els.node.isRoot)
						{
							return false;
						}
					}

					nodes.parent = nodes.node.parentNode;
					els.parent = nodes.parent.getElement();

					// сохраняем ссылки на первый и последний элементы для undo
					data.first = nodes.node.firstChild;
					data.last = nodes.node.lastChild;

					// переносим всех потомков из обёртки
					nodes.first = nodes.node.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
					while (els.first)
					{
						els.parent.insertBefore(els.first, els.node);
						nodes.parent.insertBefore(nodes.first, nodes.node);
						nodes.first = nodes.node.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}

					// удаляем обёртку
					els.parent.remove(els.node);
					nodes.parent.removeChild(nodes.node);
				}
				else
				{
					throw Error('Выделение в разработке!');
				}

				//console.log('nodes', nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// курсор
				manager.setCursor(
					{
						startNode: range.start,
						startOffset: range.offset.start,
						endNode: range.end,
						endOffset: range.offset.end,
						focusElement: range.common.getElement()
					}
				);

				// сохраняем
				data.range = range;
				data.els = els;
				data.nodes = nodes;

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
				nodes = {},
				els = {},
				res = false,
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				els = data.els;
				nodes = data.nodes;

				console.log('undo del wrapper ' + me.elementName, data, range);

				if (range.collapsed)
				{
					nodes.first = data.first;
					els.first = nodes.first.getElement();
					nodes.last = data.last;
					els.last = nodes.last.getElement();

					// восстанавливаем обёртку
					nodes.node = els.node.getNode(data.viewportId);
					els.parent.insertBefore(els.node, els.first);
					nodes.parent.insertBefore(nodes.node, nodes.first);

					// перемещаем всех потомков обратно в обёртку
					nodes.next = nodes.first;
					els.next = nodes.next.getElement();
					while (els.next.elementId !== els.last.elementId)
					{
						nodes.buf = nodes.next.nextSibling;
						els.node.add(els.next);
						nodes.node.appendChild(nodes.next);
						nodes.next = nodes.buf;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}
					els.node.add(els.last);
					nodes.node.appendChild(nodes.last);
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					endNode: range.end,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				manager.setCursor(data.saveRange);

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