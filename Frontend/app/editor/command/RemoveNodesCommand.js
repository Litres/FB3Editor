/**
 * Удаляет выделенную часть элементов.
 * Не используется!
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.RemoveNodesCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				pos = {},
				reg = {},
				sel = window.getSelection(),
				factory = FBEditor.editor.Factory,
				manager,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанвливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				if (range.collapsed)
				{
					throw Error('Отсутствует выделение');
				}

				// TODO проверить перед удалением на допустимость получаемой структуры согласно схеме

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				manager = els.common.getManager();
				manager.setSuspendEvent(true);

				data.viewportId = nodes.common.viewportId;

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.commonAncestorContainer.parentNode,
					collapsed: range.collapsed,
					offset: offset
				};

				console.log('remove nodes ', data.range);

				// первый элемент

				nodes.first = range.startContainer;
				els.first = nodes.first.getElement();
				els.commonId = els.common.elementId;

				while (els.first && els.first.parent.elementId !== els.commonId)
				{
					nodes.first = els.isRoot ? nodes.first.firstChild : nodes.first.parentNode;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// последний элемент

				nodes.last = range.endContainer;
				els.last = nodes.last.getElement();

				while (els.last && els.last.parent.elementId !== els.commonId)
				{
					nodes.last = els.isRoot ? nodes.last.lastChild : nodes.last.parentNode;
					els.last = nodes.last ? nodes.last.getElement() : null;
				}

				// позиция выделения относительно затронутых элементов
				pos.isStart = els.first.isStartRange(range);
				pos.isEnd = els.last.isEndRange(range);
				data.range.pos = pos;
				
				//console.log('pos', pos, range.toString());

				if (!pos.isStart)
				{
					// разбиваем первый элемент
					nodes.container = range.startContainer;
					nodes.start = manager.splitNode(els, nodes, offset.start);
				}
				else
				{
					nodes.start = nodes.first;
				}

				if (!pos.isEnd)
				{
					// разбиваем последний элемент
					nodes.container = range.endContainer;
					nodes.end = manager.splitNode(els, nodes, offset.end);
					nodes.cursor = nodes.end;
					nodes.startCursor = 0;
					nodes.end = nodes.end.previousSibling;
				}
				else
				{
					nodes.end = nodes.last;
					if (nodes.start.previousSibling)
					{
						nodes.cursor = manager.getDeepFirst(nodes.start.previousSibling);
						nodes.startCursor = nodes.cursor.nodeValue ? nodes.cursor.nodeValue.length : 0;
					}
				}

				els.start = nodes.start.getElement();
				els.end = nodes.end.getElement();
				nodes.parent = nodes.common;
				els.parent = els.common;

				//console.log('nodes, els', nodes, els);return false;

				// удаляем элементы

				els.removed = [];
				nodes.removed = [];

				nodes.next = nodes.start;
				els.next = nodes.next.getElement();

				while (els.next && !els.next.equal(els.end))
				{
					els.removed.push(els.next);
					nodes.removed.push(nodes.next);

					nodes.buf = nodes.next.nextSibling;
					els.parent.remove(els.next);
					nodes.parent.removeChild(nodes.next);
					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}

				nodes.nextCursor = nodes.next.nextSibling ? nodes.next.nextSibling : null;
				els.removed.push(els.next);
				nodes.removed.push(nodes.next);
				els.parent.remove(els.next);
				nodes.parent.removeChild(nodes.next);

				nodes.first = nodes.parent.firstChild;

				if (!nodes.first)
				{
					// если в родительском элементе не осталось потомков, то вставляем в него пустой параграф
					els.isEmpty = true;

					// пустой параграф
					els.p = manager.createEmptyP();
					els.newEl = els.p;

					if (els.parent.isRoot && !els.parent.isDesc)
					{
						// в корневом элементе должна быть хотя бы одна секция
						els.s = factory.createElement('section');
						els.s.add(els.p);
						els.newEl = els.s;
					}

					nodes.newEl = els.newEl.getNode(data.viewportId);

					els.parent.add(els.newEl);
					nodes.parent.appendChild(nodes.newEl);

					nodes.cursor = manager.getDeepFirst(nodes.newEl);
					nodes.startCursor = 0;
				}

				//console.log('nodes, els', nodes, els);

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.startCursor
					}
				);

				// сохраняем узлы
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				console.log('nodes', nodes);
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
				range;

			try
			{
				range = data.range;
				nodes = data.nodes;
				els = data.els;

				manager = els.parent.getManager();
				manager.setSuspendEvent(true);

				console.log('undo remove nodes ', data, nodes);

				if (els.isEmpty)
				{
					// удаляем пустой параграф или секцию
					els.parent.remove(els.newEl);
					nodes.parent.removeChild(nodes.newEl);
					nodes.nextCursor = null;
				}

				// восстанавливаем удлаенные элементы
				Ext.Array.each(
					nodes.removed,
					function (node)
					{
						if (nodes.nextCursor)
						{
							els.nextCursor = nodes.nextCursor.getElement();
							els.parent.insertBefore(node.getElement(), els.nextCursor);
							nodes.parent.insertBefore(node, nodes.nextCursor);
						}
						else
						{
							els.parent.add(node.getElement());
							nodes.parent.appendChild(node);
						}
					}
				);

				if (!range.pos.isStart)
				{
					// соединяем первый элемент
					nodes.prev = nodes.removed[0].previousSibling;
					manager.joinNode(nodes.removed[0]);

					// удаляем пустые элементы
					manager.removeEmptyNodes(nodes.prev);
				}

				if (!range.pos.isEnd)
				{
					// соединяем последний элемент
					manager.joinNode(nodes.nextCursor);

					// удаляем пустые элементы
					manager.removeEmptyNodes(nodes.removed[nodes.removed.length - 1]);
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
				};

				data.nodes = nodes;

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