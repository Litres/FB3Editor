/**
 * Удаляет выделенную часть текста.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractRemoveRangeNodesCommand',
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
				sel = window.getSelection(),
				range,
				manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				if (range.collapsed)
				{
					throw Error('Отсутствует выделение');
				}

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				data.viewportId = nodes.common.viewportId;

				els.startContainer = range.startContainer.getElement();
				els.endContainer = range.endContainer.getElement();

				if (els.startContainer.elementId === els.common.elementId &&
				    els.endContainer.elementId === els.common.elementId &&
				    !els.common.isText)
				{
					// некорректное выделение
					throw Error('Некорректное выделение');
				}

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

				if (els.startContainer.elementId === els.common.elementId && !els.common.isText)
				{
					// некорректное начальное выделение
					data.range.start = nodes.common.firstChild;
					data.range.offset.start = 0;
					els.startContainer = data.range.start.getElement();
				}
				else if (els.endContainer.elementId === els.common.elementId && !els.common.isText)
				{
					// некорректное конечное выделение
					data.range.end = nodes.common.lastChild;
					data.range.offset.end = 0;
					els.endContainer = data.range.end.getElement();
				}

				if (els.startContainer.elementId === els.endContainer.elementId && !els.common.isText)
				{
					nodes.common = data.range.start;
					data.range.common = nodes.common;
					els.common = nodes.common.getElement();
				}

				console.log('remove range ' + me.elementName, data.range);

				// удаленные элементы
				nodes.removed = [];

				// курсор
				nodes.cursor = nodes.common;
				nodes.startCursor = data.range.offset.start;

				if (els.common.isText)
				{
					// выделение только в текстовом узле

					nodes.parent = nodes.common.parentNode;
					els.parent = nodes.parent.getElement();

					// сохраняем старое значение
					data.oldValue = nodes.common.nodeValue;

					if (data.range.offset.start === 0 && data.range.offset.end === nodes.common.nodeValue.length)
					{
						nodes.next = nodes.common.nextSibling;
						nodes.prev = nodes.common.previousSibling;

						// удаляем текстовый узел
						nodes.removed.push(nodes.common);
						els.parent.remove(els.common);
						nodes.parent.removeChild(nodes.common);

						if (!els.parent.isEmpty())
						{
							// курсор
							nodes.cursor = nodes.next ? nodes.next : nodes.prev;
							if (nodes.next)
							{
								while (nodes.cursor && nodes.cursor.firstChild)
								{
									// ищем самый вложенный первый узел
									nodes.cursor = nodes.cursor.firstChild;
								}
							}
							else
							{
								while (nodes.cursor && nodes.cursor.lastChild)
								{
									// ищем самый вложенный последний узел
									nodes.cursor = nodes.cursor.lastChild;
								}
								nodes.startCursor = nodes.cursor.getElement().isText ?
								                    nodes.cursor.nodeValue.length : 0;
							}
						}
					}
					else
					{
						// получаем части текста
						els.startValue = nodes.common.nodeValue.substring(0, data.range.offset.start);
						els.endValue = nodes.common.nodeValue.substring(data.range.offset.end);

						// меняем текст исходного элемента
						els.common.setText(els.startValue + els.endValue);
						nodes.common.nodeValue = els.startValue + els.endValue;
					}
				}
				else
				{
					els.startContainer = range.startContainer.getElement();
					els.endContainer = range.endContainer.getElement();

					// необходимо ли переместить указатель для последнего выделенного элемента
					els.needPrevEnd = els.endContainer.isText && data.range.offset.end < els.endContainer.text.length;

					// разбиваем конечный узел текущего выделения
					nodes.common = data.range.common;
					els.common = nodes.common.getElement();
					nodes.container = data.range.end;
					nodes.end = manager.splitNode(els, nodes, data.range.offset.end);
					nodes.end = els.needPrevEnd ? nodes.end.previousSibling : nodes.end;
					els.end = nodes.end.getElement();
					if (els.end.isEmpty())
					{
						// удаляем пустой конечный узел
						nodes.prev = nodes.end.previousSibling;
						els.common.remove(els.end);
						nodes.common.removeChild(nodes.end);
						nodes.end = nodes.prev;
						els.end = nodes.end.getElement();
					}

					// разбиваем начальный узел текущего выделения
					nodes.container = data.range.start;
					nodes.start = manager.splitNode(els, nodes, data.range.offset.start);
					els.start = nodes.start.getElement();
					nodes.prev = nodes.start.previousSibling;
					els.prev = nodes.prev ? nodes.prev.getElement() : null;
					if (els.prev && els.prev.isEmpty())
					{
						// удаляем пустой начальный узел
						els.common.remove(els.prev);
						nodes.common.removeChild(nodes.prev);
					}

					nodes.parent = nodes.common;
					els.parent = nodes.parent.getElement();

					// курсор
					nodes.nextCursor = nodes.end.nextSibling;
					nodes.prevCursor = nodes.start.previousSibling;
					els.nextCursor = nodes.nextCursor ? nodes.nextCursor.getElement() : null;
					els.prevCursor = nodes.prevCursor ? nodes.prevCursor.getElement() : null;

					// удаляем получившиеся узлы между начальным и конечным включительно
					nodes.next = nodes.start;
					els.next = nodes.next ? nodes.next.getElement() : null;
					while (els.next && els.next.elementId !== els.end.elementId)
					{
						nodes.buf = nodes.next.nextSibling;

						nodes.removed.push(nodes.next);
						els.parent.remove(els.next);
						nodes.parent.removeChild(nodes.next);

						nodes.next = nodes.buf;

						els.next = nodes.next ? nodes.next.getElement() : null;
					}
					nodes.removed.push(nodes.end);
					els.parent.remove(els.end);
					nodes.parent.removeChild(nodes.end);

					nodes.start = nodes.prevCursor;
					els.start = nodes.start ? nodes.start.getElement() : null;
					nodes.end = nodes.nextCursor;
					els.end = nodes.end ? nodes.end.getElement() : null;
					if (els.prevCursor && els.nextCursor && els.prevCursor.isText && els.nextCursor.isText)
					{
						// объединяем два соседних текстовых узла в один,
						// которые получились в результате удаления выделения
						manager.joinNode(nodes.nextCursor);
						nodes.cursor = nodes.prevCursor;

						// при undo необходимо будет разбить узел обратно
						data.range.needSplit = true;
					}
					else if (!els.parent.isEmpty())
					{
						// курсор
						nodes.cursor = nodes.nextCursor ? nodes.nextCursor : nodes.prevCursor;
						if (nodes.nextCursor)
						{
							nodes.startCursor = 0;
						}
						else
						{
							while (nodes.cursor.firstChild)
							{
								nodes.cursor = nodes.cursor.firstChild;
							}
							nodes.startCursor = nodes.cursor.nodeValue.length;
						}
					}
				}

				if (els.parent.isEmpty())
				{
					// вставляем пустой элемент

					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);
					els.parent.add(els.empty);
					nodes.parent.appendChild(nodes.empty);

					// курсор
					nodes.cursor = nodes.empty;
				}

				//console.log('nodes, els', nodes, els);

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.startCursor,
						focusElement: nodes.cursor.getElement()
					}
				);

				// сохраняем узлы
				data.nodes = nodes;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				console.log('nodes', nodes);
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
				factory = FBEditor.editor.Factory,
				range,
				restoreRange;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.nodes;

				restoreRange = window.getSelection().getRangeAt(0);

				if (!range.common.parentNode)
				{
					// восстанавливаем потерянную ссылку из текущего выделения

					range.common = restoreRange.commonAncestorContainer;
					data.range.common = range.common;
					data.range.start = range.common;
					data.range.end = range.common;
				}

				nodes.common = range.common;
				els.common = nodes.common.getElement();

				els.parent = nodes.parent.getElement();

				console.log('undo remove range ' + me.elementName, data, nodes);

				if (els.parent.isEmpty())
				{
					// удаляем пустой элемент из старого
					nodes.empty = nodes.parent.firstChild;
					els.empty = nodes.empty.getElement();
					els.parent.remove(els.empty);
					nodes.parent.removeChild(nodes.empty);
				}

				if (els.common.isText)
				{
					// был выделен только текстовый узел

					if (els.parent.isEmpty())
					{
						// вставляем текстовый элемент
						els.text = factory.createElementText(data.oldValue);
						nodes.text = els.text.getNode(data.viewportId);
						els.parent.add(els.text);
						nodes.parent.appendChild(nodes.text);
						range.start = nodes.text;
						range.end = nodes.text;
					}
					else if (nodes.next)
					{
						// вставляем текстовый элемент перед следующим узлом

						els.text = factory.createElementText(data.oldValue);
						nodes.text = els.text.getNode(data.viewportId);
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.text, els.next);
						nodes.parent.insertBefore(nodes.text, nodes.next);
						range.start = nodes.text;
						range.end = nodes.text;
					}
					else if (nodes.prev)
					{
						// вставляем текстовый элемент в конец родителя

						els.text = factory.createElementText(data.oldValue);
						nodes.text = els.text.getNode(data.viewportId);
						els.parent.add(els.text);
						nodes.parent.appendChild(nodes.text);
						range.start = nodes.text;
						range.end = nodes.text;
					}
					else
					{
						// меняем текст исходного элемента
						els.common.setText(data.oldValue);
						nodes.common.nodeValue = data.oldValue;
					}
				}

				if (nodes.removed.length)
				{
					// восстанавливаем удаленные элементы

					if (range.needSplit)
					{
						// разбиваем текстовый узел
						els.common = range.common.getElement();
						nodes.container = nodes.cursor;
						nodes.nextCursor = manager.splitNode(els, nodes, range.offset.start);
					}

					// для курсора
					nodes.startCursor = nodes.prevCursor ? nodes.prevCursor : nodes.removed[0];
					while (nodes.startCursor.firstChild)
					{
						nodes.startCursor = nodes.startCursor.firstChild;
					}
					range.start = nodes.startCursor;

					if (nodes.nextCursor && !nodes.nextCursor.parentNode)
					{
						// восстанавливаем ссылку
						if (nodes.prevCursor && nodes.prevCursor.parentNode && nodes.prevCursor.nextSibling)
						{
							nodes.nextCursor = nodes.prevCursor.nextSibling;
						}
						else
						{
							nodes.nextCursor = restoreRange.startContainer;
							range.start = nodes.nextCursor;
						}
						els.ignoreJoin = true;
						range.end = nodes.nextCursor;
					}

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

					// для курсора
					nodes.endCursor = nodes.removed[nodes.removed.length - 1];
					while (nodes.endCursor.lastChild)
					{
						nodes.endCursor = nodes.endCursor.lastChild;
					}
					range.end = nodes.endCursor;

					// объединяем узлы
					if (nodes.nextCursor && !els.ignoreJoin)
					{
						manager.joinNode(nodes.nextCursor);
					}
					if (nodes.prevCursor)
					{
						manager.joinNode(nodes.removed[0]);
					}
					els.parent.removeEmptyText();
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: els.parent
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

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