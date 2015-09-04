/**
 * Абстрактная команда создания элемента из выделения.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				manager = FBEditor.editor.Manager,
				factory = manager.getFactory(),
				sel,
				collapsed,
				range,
				joinStartContainer,
				joinEndContainer;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанваливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.common.permit.splittable)
				{
					nodes.common = nodes.common.parentNode;
					els.common = nodes.common.getElement();
					if (els.common.isRoot)
					{
						return false;
					}
				}

				data.viewportId = nodes.common.viewportId;

				collapsed = range.collapsed;
				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				joinStartContainer = range.startOffset === 0 ?
				                     !manager.isFirstNode(nodes.common, range.startContainer) : true;
				joinEndContainer = range.endOffset === range.endContainer.nodeValue.length ?
				                     !manager.isLastNode(nodes.common, range.endContainer) : true;
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: collapsed,
					offset: offset,
					joinStartContainer: joinStartContainer,
					joinEndContainer : joinEndContainer
				};

				//console.log('range', data.range);

				nodes.startContainer = range.startContainer;
				nodes.endContainer = range.endContainer;

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.endContainer = manager.splitNode(els, nodes, offset.end);
				els.endContainer = nodes.endContainer.getElement();

				if (els.endContainer.isEmpty() && !els.common.isEmpty() && nodes.endContainer.previousSibling)
				{
					// удаляем пустой последний контейнер
					//console.log('удален пустой узел после разделения');
					nodes.prev = nodes.endContainer.previousSibling;

					els.common.remove(els.endContainer);
					nodes.common.removeChild(nodes.endContainer);

					nodes.endContainer = nodes.prev;
					nodes.endContainer = joinEndContainer ? nodes.endContainer.previousSibling : nodes.endContainer;
				}

				// начальный узел текущего выделения
				if (collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = manager.splitNode(els, nodes, offset.start);
				}

				//console.log('nodes', nodes, data.range);

				els.startContainer = nodes.startContainer.getElement();
				nodes.endContainer = nodes.endContainer.parentNode ? nodes.endContainer : nodes.startContainer;
				els.endContainer = nodes.endContainer.getElement();

				// создаем новый элемент
				els.node = factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);

				//console.log('nodes', nodes, range);
				//return;

				// вставляем новый элемент
				els.common.insertBefore(els.node, els.startContainer);
				nodes.common.insertBefore(nodes.node, nodes.startContainer);

				// переносим элементы, которые находятся в текущем выделении в новый элемент
				nodes.next = nodes.startContainer;
				els.next = nodes.next.getElement();
				while (els.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);

					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}
				if (els.next && els.next.elementId === els.endContainer.elementId && !joinEndContainer)
				{
					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);
				}

				// синхронизируем
				els.common.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.node.firstChild
					}
				);

				// сохраянем узлы
				data.saveNodes = nodes;

				// проверяем по схеме
				me.verifyElement(els.parent);

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
				range,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				console.log('undo create range ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// переносим все элементы обратно в исходный контейнер
				nodes.first = nodes.node.firstChild;
				els.first = nodes.first.getElement();
				while (els.first)
				{
					els.parent.insertBefore(els.first, els.node);
					nodes.parent.insertBefore(nodes.first, nodes.node);
					nodes.first = nodes.node.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// удаляем новый элемент
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					manager.joinNode(nodes.startContainer);
				}
				if (range.joinEndContainer)
				{
					manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				manager.suspendEvent = false;

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
					endOffset: range.offset.end
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