/**
 * Команда разделения секции на две.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.SplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractSplitCommand',

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
				range,
				joinStartContainer;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				nodes.prevNode = data.node;
				data.viewportId = nodes.prevNode.viewportId;
				els.prevNode = nodes.prevNode.getElement();

				range = sel.getRangeAt(0);
				collapsed = range.collapsed;
				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				joinStartContainer = range.startOffset === 0 ?
				                     me.isFirstContainer(data.node.parentNode, range.startContainer) : true;
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: collapsed,
					offset: offset,
					joinStartContainer: joinStartContainer
				};

				//console.log('range', data.range);

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

				// создаем новую секцию
				els.node = FBEditor.editor.Factory.createElement('section');

				//console.log('nodes', nodes);

				// вставляем новую секцию
				nodes.parent = nodes.prevNode.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.next = nodes.prevNode.nextSibling;
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				// формируем заголовок новой секции
				if (!collapsed)
				{
					// создаем заголовок
					els.title = FBEditor.editor.Factory.createElement('title');
					els.node.add(els.title);
					nodes.title = els.title.getNode(data.viewportId);
					nodes.node.appendChild(nodes.title);

					// переносим элементы, которые выделены, из старой секции в заголовок
					nodes.next = nodes.startContainer;
					els.next = nodes.next ? nodes.next.getElement() : null;
					els.next = nodes.next.getElement();
					nodes.parentNext = nodes.next.parentNode;
					els.parentNext = nodes.parentNext.getElement();
					while (nodes.next && els.next.elementId !== els.endContainer.elementId)
					{
						nodes.buf = nodes.next.nextSibling;

						els.title.add(els.next);
						nodes.title.appendChild(nodes.next);
						els.parentNext.remove(els.next);

						nodes.next = nodes.buf;
						els.next = nodes.next.getElement();
					}
				}

				// переносим элементы, которые находятся после текущего выделения, из старой секции в новую
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
					// добавляем пустой параграф в старую секцию
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

				// сохраянем узлы
				data.saveNodes = nodes;

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
				sel = window.getSelection(),
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;
				console.log('undo split section', range, nodes);

				els.node = nodes.node.getElement();
				els.prevNode = nodes.prevNode.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// переносим все элементы из новой секции в старую

				if (nodes.title)
				{
					// переносим элементы из заголовка
					els.title = nodes.title.getElement();
					nodes.first = nodes.title.firstChild;
					while (nodes.first)
					{
						els.first = nodes.first.getElement();
						nodes.prevNode.appendChild(nodes.first);
						els.prevNode.add(els.first);
						els.title.remove(els.first);
						nodes.first = nodes.title.firstChild;
					}

					// удаляем заголовок
					nodes.node.removeChild(nodes.title);
					els.node.remove(els.title);
				}

				nodes.first = nodes.node.firstChild;
				while (nodes.first)
				{
					els.first = nodes.first.getElement();
					nodes.prevNode.appendChild(nodes.first);
					els.prevNode.add(els.first);
					els.node.remove(els.first);
					nodes.first = nodes.node.firstChild;
				}

				// удаляем новую секцию
				nodes.parent.removeChild(nodes.node);
				els.parent.remove(els.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					FBEditor.editor.Manager.joinNode(nodes.startContainer);
				}
				if (!range.collapsed)
				{
					FBEditor.editor.Manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем выделение
				if (!range.joinStartContainer)
				{
					range.start = nodes.startContainer;
					range.common = range.start.getElement().isText ? range.start.parentNode : range.start;
				}
				else
				{
					range.common = range.common.getElement().isText ? range.common.parentNode : range.common;
				}
				range.common = range.common ? range.common : range.prevParentStart.parentNode;
				range.start = range.start.parentNode ? range.start : range.prevParentStart.nextSibling;
				range.end = range.collapsed || !range.end.parentNode ? range.start : range.end;
				range.end = !range.collapsed && range.end.firstChild ? range.end.firstChild : range.end;
				//console.log('cursor range', range);
				sel.collapse(range.start, range.offset.start);
				sel.extend(range.end, range.offset.end);
				FBEditor.editor.Manager.setFocusElement(range.common.getElement(), sel);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
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

			FBEditor.editor.Manager.setFocusElement(els.cursor);
			sel.collapse(nodes.cursor);
		}
	}
);