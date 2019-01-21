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
		syncButtons: false,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				nodes = {},
				pos = {},
				viewportId,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанавливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();

				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				console.log('split ' + me.elementName, range);

				nodes.node = range.start;
				viewportId = data.viewportId = nodes.node.viewportId;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();

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
				nodes.newP = els.newP.getNode(viewportId);

				if (nodes.nextP)
				{
					els.nextP = nodes.nextP.getElement();
					els.parentP.insertBefore(els.newP, els.nextP, viewportId);
				}
				else
				{
					els.parentP.add(els.newP, viewportId);
				}

				if (!els.p.isEmpty() && range.start.getElement().isText)
				{
					pos.isEnd = range.end.nodeValue && range.offset.end === range.end.nodeValue.length ?
					            manager.isLastNode(nodes.p, range.end) : false;
					pos.isStart = range.offset.start === 0 ?
					              manager.isFirstNode(nodes.p, range.start) : false;

					nodes.common = nodes.p;
					els.common = els.p;
					nodes.container = range.start;
					nodes.parentContainer = nodes.container.parentNode;
					els.parentContainer = nodes.parentContainer.getElement();

					pos.needSplit = !pos.isStart && !pos.isEnd;
					pos.needSplit = els.parentContainer.elementId === els.p.elementId &&
					                range.end.nodeValue &&
					                range.offset.end === range.end.nodeValue.length ?
					                false : pos.needSplit;

					range.pos = pos;
					//console.log('pos', pos, range.toString());

					if (pos.needSplit)
					{
						// делим узел
						nodes.start = manager.splitNode(els, nodes, range.offset.start);

						els.common.removeEmptyText();

						els.start = nodes.start.getElement();

						nodes.prev = nodes.start.previousSibling;
						els.prev = nodes.prev ? nodes.prev.getElement() : null;

						if (els.prev && els.prev.isEmpty())
						{
							// удаляем пустой начальный элемент
							els.p.remove(els.prev, viewportId);
						}
						if (els.start.isEmpty())
						{
							// удаляем пустой конечный элемент
							els.p.remove(els.start, viewportId);
							nodes.start = null;
						}
					}
					else if (range.offset.start === 0)
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
						els.newP.add(els.next, viewportId);
						nodes.next = nodes.buf;
					}


					if (els.p.isEmpty())
					{
						// вставляем пустой элемент в исходный
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(viewportId);

						els.p.add(els.empty);
						nodes.p.appendChild(nodes.empty);
						nodes.node = nodes.empty;
					}
				}

				if (els.newP.isEmpty())
				{
					// вставляем пустой элемент в новый
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(viewportId);

					els.newP.add(els.empty);
					nodes.newP.appendChild(nodes.empty);
				}

				els.parentP.sync(data.viewportId);

				// устанавливаем курсор
				nodes.cursor = manager.getDeepFirst(nodes.newP);
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: nodes.cursor
					}
				);

				// сохраняем ссылки
				data.nodes = nodes;

				// проверяем по схеме
				me.verifyElement(els.parentP);
				
				// скроллим окно вниз, если курсора не видно 
				manager.scrollViewDown();

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
				viewportId = data.viewportId,
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
				manager = els.node.getManager();
				manager.removeAllOverlays();
				els.newP = nodes.newP.getElement();
				els.parentP = nodes.parentP.getElement();
				els.prev = nodes.prev ? nodes.prev.getElement() : null;
				els.start = nodes.start ? nodes.start.getElement() : null;
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
						els.p.remove(els.node, viewportId);
					}

					if (!els.newP.isEmpty())
					{
						// переносим все элементы из нового в старый
						nodes.first = nodes.newP.firstChild;
						while (nodes.first)
						{
							els.first = nodes.first.getElement();
							els.p.add(els.first, viewportId);
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
				els.parentP.remove(els.newP, viewportId);

				els.parentP.sync(viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

				// скроллим окно вверх, если курсора не видно 
				manager.scrollViewUp();

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