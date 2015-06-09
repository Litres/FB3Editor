/**
 * Команда разделения блока.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.SplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				sel = window.getSelection(),
				collapsed,
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				nodes.prevNode = data.node;
				data.viewportId = nodes.prevNode.viewportId;
				els.prevNode = nodes.prevNode.getElement();

				range = sel.getRangeAt(0);
				collapsed = range.collapsed;
				console.log('range', range);

				offset.start = range.startOffset;
				offset.end = range.endOffset;
				console.log('offset', offset);

				nodes.startContainer = range.startContainer;
				nodes.endContainer = range.endContainer;

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.common = data.node;
				els.common = data.node.getElement();
				nodes.endContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.end);

				// конечный узел текущего выделения
				if (collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.start);
				}

				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// создаем новый блок
				els.node = FBEditor.editor.Factory.createElement('div');

				console.log('nodes', nodes);
				console.log('els', els);

				// вставляем новый блок
				nodes.parent = nodes.prevNode.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.nextPrevNode = nodes.prevNode.nextSibling;
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.nextPrevNode)
				{
					els.nextPrevNode = nodes.nextPrevNode.getElement();
					els.parent.insertBefore(els.node, els.nextPrevNode);
					nodes.parent.insertBefore(nodes.node, nodes.nextPrevNode);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				// переносим элементы, которые находятся в текущем выделении, из старого блока в новый
				if (!collapsed)
				{
					nodes.next = nodes.startContainer;
					els.next = nodes.next ? nodes.next.getElement() : null;
					nodes.parentNext = nodes.next.parentNode;
					els.parentNext = nodes.parentNext.getElement();
					while (nodes.next && els.next.elementId !== els.endContainer.elementId)
					{
						nodes.buf = nodes.next.nextSibling;

						els.node.add(els.next);
						nodes.node.appendChild(nodes.next);
						els.parentNext.remove(els.next);

						nodes.next = nodes.buf;
						els.next = nodes.next.getElement();
					}

					// создаем новый блок
					els.node = FBEditor.editor.Factory.createElement('div');
					nodes.node = els.node.getNode(data.viewportId);
					if (nodes.nextPrevNode)
					{
						els.nextPrevNode = nodes.nextPrevNode.getElement();
						els.parent.insertBefore(els.node, els.nextPrevNode);
						nodes.parent.insertBefore(nodes.node, nodes.nextPrevNode);
					}
					else
					{
						els.parent.add(els.node);
						nodes.parent.appendChild(nodes.node);
					}
				}

				// переносим элементы, которые находятся после текущего выделения, из старого блока в новый
				nodes.next = nodes.endContainer;
				nodes.parentNext = nodes.next.parentNode;
				els.parentNext = nodes.parentNext.getElement();
				while (nodes.next)
				{
					nodes.buf = nodes.next.nextSibling;
					els.next = nodes.next.getElement();

					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);
					els.parentNext.remove(els.next);

					nodes.next = nodes.buf;
				}

				if (!nodes.parentNext.firstChild)
				{
					// добавляем пустой параграф в старый элемент
					els.p = FBEditor.editor.Factory.createElement('p');
					els.empty = FBEditor.editor.Manager.createEmptyElement();
					els.p.add(els.empty);
					els.parentNext.add(els.p);
					nodes.parentNext.appendChild(els.p.getNode(data.viewportId));
				}

				// синхронизируем
				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = nodes.node.firstChild;
				els.cursor = nodes.cursor.getElement();
				me.setCursor(els, nodes);

				// сохраянем узел
				//data.node = nodes.start;

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
			return false;
		},

		/**
		 * Устанавливает курсор.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		setCursor: function (els, nodes)
		{
			var me = this,
				sel = window.getSelection(),
				data = me.getData();

			data.oldRange = sel.getRangeAt(0);
			FBEditor.editor.Manager.setFocusElement(els.cursor);
			sel.collapse(nodes.cursor);
		}
	}
);