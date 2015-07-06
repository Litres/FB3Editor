/**
 * Удаляет элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.DeleteCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				range,
				manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('del el', data, range);

				els.node = data.el;
				nodes.node = els.node.nodes[data.viewportId];
				els.parent = els.node.parent;
				nodes.parent = els.parent.nodes[data.viewportId];
				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.prev = nodes.node.previousSibling;
				els.prev = nodes.prev ? nodes.prev.getElement() : null;

				// удаляем
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				nodes.first = nodes.parent.firstChild;

				if (!nodes.first)
				{
					// если в родительском элементе не осталось потомков, то вставляем в него пустой параграф

					// пустой параграф
					els.p = manager.createEmptyP();
					els.new = els.p;

					if (els.parent.isRoot)
					{
						// в корневом элементе должна быть хотя бы одна секция
						els.s = FBEditor.editor.Factory.createElement('section');
						els.s.add(els.p);
						els.new = els.s;
					}

					nodes.new = els.new.getNode(data.viewportId);

					els.parent.add(els.new);
					nodes.parent.appendChild(nodes.new);
				}

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				//console.log('del', nodes);

				// устанавливаем курсор
				nodes.cursor = nodes.new ? nodes.new : nodes.next;
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.prev;
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.parent;
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: 0,
					focusElement: nodes.cursor.getElement()
				};
				manager.setCursor(data.saveRange);

				// сохраняем
				data.els = els;
				data.range = range;

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
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.range;
				els = data.els;

				nodes.node = els.node.nodes[data.viewportId];
				nodes.parent = els.parent.nodes[data.viewportId];

				console.log('undo del el', nodes, els, range);

				if (els.new)
				{
					// заменяем новый элемент на старый
					nodes.new = els.new.nodes[data.viewportId];
					els.parent.replace(els.node, els.new);
					nodes.parent.replaceChild(nodes.node, nodes.new);
				}
				else if (els.next)
				{
					// вставляем старый перед предыдущим
					nodes.next = els.next.nodes[data.viewportId];
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					// добавляем старый
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					focusElement: els.node
				};
				FBEditor.editor.Manager.setCursor(data.saveRange);

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