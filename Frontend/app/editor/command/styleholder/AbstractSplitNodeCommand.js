/**
 * Разбивает элемент на два.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractSplitNodeCommand',
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
				pos = {},
				sel = window.getSelection(),
				range,
				factory = FBEditor.editor.Factory,
				manager;

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

				data.viewportId = range.startContainer.viewportId;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.commonAncestorContainer.parentNode,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				console.log('split ' + me.elementName, data.range);

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();

				console.log(els.p.getXml());

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				if (els.node.isEmpty() && nodes.node.firstChild || els.node.isStyleHolder)
				{
					// пустой элемент
					nodes.node = nodes.node.firstChild;
					els.node = nodes.node.getElement();
					nodes.p = nodes.node;
					els.p = nodes.p.getElement();
				}

				// ищем самый верхний контейнер
				while (!els.p.hisName(me.elementName))
				{
					nodes.node = nodes.p;
					els.node = nodes.node.getElement();
					nodes.p = nodes.p.parentNode;
					els.p = nodes.p.getElement();
				}

				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();

				nodes.nextP = nodes.p.nextSibling;

				// новый элемент

				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(data.viewportId);

				if (nodes.nextP)
				{
					els.nextP = nodes.nextP.getElement();
					els.parentP.insertBefore(els.newP, els.nextP);
					nodes.parentP.insertBefore(nodes.newP, nodes.nextP);
				}
				else
				{
					els.parentP.add(els.newP);
					nodes.parentP.appendChild(nodes.newP);
				}

				if (!els.p.isEmpty() && data.range.start.getElement().isText)
				{
					pos.isEnd = data.range.end.nodeValue && data.range.offset.end === data.range.end.nodeValue.length ?
					            manager.isLastNode(nodes.p, data.range.end) : false;
					pos.isStart = data.range.offset.start === 0 ?
					              manager.isFirstNode(nodes.p, data.range.start) : false;

					nodes.common = nodes.p;
					els.common = els.p;
					nodes.container = data.range.start;
					nodes.parentContainer = nodes.container.parentNode;
					els.parentContainer = nodes.parentContainer.getElement();

					pos.needSplit = !pos.isStart && !pos.isEnd;
					pos.needSplit = els.parentContainer.elementId === els.p.elementId &&
					                data.range.end.nodeValue &&
					                data.range.offset.end === data.range.end.nodeValue.length ?
					                false : pos.needSplit;

					data.range.pos = pos;
					console.log('pos', pos, range.toString());

					if (pos.needSplit)
					{
						// делим узел
						nodes.start = manager.splitNode(els, nodes, data.range.offset.start);

						els.common.removeEmptyText();

						els.start = nodes.start.getElement();

						nodes.prev = nodes.start.previousSibling;
						els.prev = nodes.prev ? nodes.prev.getElement() : null;

						if (els.prev && els.prev.isEmpty())
						{
							// удаляем пустой начальный элемент
							els.p.remove(els.prev);
							nodes.p.removeChild(nodes.prev);
						}
						if (els.start.isEmpty())
						{
							// удаляем пустой конечный элемент
							els.p.remove(els.start);
							nodes.p.removeChild(nodes.start);
							nodes.start = null;
						}
					}
					else if (data.range.offset.start === 0)
					{
						nodes.start = nodes.node;
					}
					else
					{
						nodes.start = nodes.node.nextSibling;
					}

					nodes.next = nodes.start;

					// переносим все элементы из старого в новый
					while (nodes.next)
					{
						nodes.buf = nodes.next.nextSibling;
						els.next = nodes.next.getElement();
						els.newP.add(els.next);
						nodes.newP.appendChild(nodes.next);
						nodes.next = nodes.buf;
					}


					if (els.p.isEmpty())
					{
						// вставляем пустой элемент в исходный
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(data.viewportId);

						els.p.add(els.empty);
						nodes.p.appendChild(nodes.empty);
						nodes.node = nodes.empty;
					}
				}

				if (els.newP.isEmpty())
				{
					// вставляем пустой элемент в новый
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.newP.add(els.empty);
					nodes.newP.appendChild(nodes.empty);
				}

				els.parentP.sync(data.viewportId);

				// устанавливаем курсор
				nodes.cursor = manager.getDeepFirst(nodes.newP);
				manager.setCursor(
					{
						startNode: nodes.cursor
					}
				);

				// сохраняем ссылки
				me.data.nodes = nodes;

				console.log(els.parentP.getXml());

				// проверяем по схем
				me.verifyElement(els.parentP);

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
				range,
				manager;

			try
			{
				// исходные данные
				nodes = data.nodes;
				range = data.range;

				console.log('undo split ' + me.elementName, nodes, data);

				els.p = nodes.p.getElement();
				els.node = nodes.node.getElement();
				els.newP = nodes.newP.getElement();
				els.parentP = nodes.parentP.getElement();
				els.prev = nodes.prev ? nodes.prev.getElement() : null;
				els.start = nodes.start ? nodes.start.getElement() : null;

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// курсор
				nodes.cursor = range.start;

				if (els.p.isEmpty() && els.newP.isEmpty())
				{
					nodes.cursor = nodes.node;
				}
				else
				{
					// восстанавливаем исходный текст
					if (els.p.isEmpty())
					{
						// удаляем пустой элемент из старого
						els.p.remove(els.node);
						nodes.p.removeChild(nodes.node);
					}

					if (!els.newP.isEmpty())
					{
						// переносим все элементы из нового в старый
						nodes.first = nodes.newP.firstChild;
						while (nodes.first)
						{
							els.first = nodes.first.getElement();
							els.p.add(els.first);
							nodes.p.appendChild(nodes.first);
							nodes.first = nodes.newP.firstChild;
						}

						// курсор
						nodes.cursor = nodes.cursor.parentNode ? nodes.cursor : nodes.p.firstChild;
					}

					if (els.prev && els.prev.hisName(els.start.xmlTag))
					{
						// объединяем узлы
						manager.joinNode(nodes.start);
						els.parentP.removeEmptyText();
					}
				}

				// удаляем новый элемент
				els.parentP.remove(els.newP);
				nodes.parentP.removeChild(nodes.newP);

				els.parentP.sync(data.viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start,
					focusElement: els.p
				};
				manager.setCursor(data.saveRange);

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