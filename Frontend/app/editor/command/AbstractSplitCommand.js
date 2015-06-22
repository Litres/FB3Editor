/**
 * Абстрактный класс команды разделения элемента на несколько элементов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractSplitCommand',
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
				range,
				joinStartContainer;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				nodes.prevNode = data.node;
				data.viewportId = nodes.prevNode.viewportId;
				els.prevNode = nodes.prevNode.getElement();

				if (data.saveRange)
				{
					// восстанваливаем выделение
					FBEditor.editor.Manager.setCursor(data.saveRange);
				}

				// получаем данные выделения
				range = sel.getRangeAt(0);
				offset = {
					start: range.startOffset,
					end: range.endOffset
				};

				// необходимо ли после операции undo соединять первый узел выделения
				joinStartContainer = range.startOffset === 0 ?
				                     !FBEditor.editor.Manager.isFirstNode(data.node, range.startContainer) : true;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: range.collapsed,
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
				if (data.range.collapsed)
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

				//console.log('nodes', nodes);

				// создаём элемент
				els.node = FBEditor.editor.Factory.createElement(me.nameElement);

				// вставляем новый элемент
				nodes.parent = nodes.prevNode.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.next = nodes.prevNode.nextSibling;
				nodes.nextPrevNode = nodes.next;
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

				// заполняем новый элемент
				me.createElement(nodes, els);

				// переносим элементы, которые находятся после текущего выделения, из старого в новый
				els.node = nodes.node.getElement();
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
				FBEditor.editor.Manager.setCursor(
					{
						startNode: nodes.node.firstChild,
						startOffset: 0,
						endNode: nodes.node.firstChild,
						endOffset: 0,
						focusElement: nodes.node.firstChild.getElement()
					}
				);

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
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;
				console.log('undo split ' + me.nameElement, range, nodes);

				els.node = nodes.node.getElement();
				els.prevNode = nodes.prevNode.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// переносим все элементы обратно

				me.restoreElement(nodes, els, range);

				nodes.first = nodes.node.firstChild;
				me.moveNodes(nodes, els);

				// удаляем новый элемент
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

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
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
		},

		/**
		 * Перемещает дочерние узлы в другой узел.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		moveNodes: function (nodes, els)
		{
			while (nodes.first)
			{
				els.first = nodes.first.getElement();
				nodes.prevNode.appendChild(nodes.first);
				els.prevNode.add(els.first);
				els.node.remove(els.first);
				nodes.first = nodes.node.firstChild;
			}
		},

		/**
		 * @template
		 * Восстанавливает элемент до применения команды.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 * @param {Object} range Выделение.
		 */
		restoreElement: function (nodes, els, range)
		{
			//
		},

		/**
		 * @template
		 * Создаёт содержимое элемента.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		createElement: function (nodes, els)
		{
			//
		}
	}
);