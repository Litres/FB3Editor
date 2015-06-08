/**
 * Команда разделения секции на две.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.SplitCommand',
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
				emptyElement = 'br',
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
				nodes.endContainer = me.splitNode(els, nodes, offset.end);

				// конечный узел текущего выделения
				if (collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = me.splitNode(els, nodes, offset.start);
				}

				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// создаем новую секцию
				els.node = FBEditor.editor.Factory.createElement('section');

				console.log('nodes', nodes);
				console.log('els', els);

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
					els.empty = FBEditor.editor.Factory.createElement(emptyElement);
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
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				range,
				viewportId;

			/*try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				range = data.oldRange;
				nodes.cursor = range.endContainer;
				els.cursor = nodes.cursor.getElement();
				FBEditor.editor.Manager.setFocusElement(els.cursor);
				sel.collapse(nodes.cursor, range.endOffset);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}*/

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

			data.oldRange = sel.getRangeAt(0);
			FBEditor.editor.Manager.setFocusElement(els.cursor);
			sel.collapse(nodes.cursor);
			//sel.extend(nodes.p.firstChild, nodes.cursor.firstChild.length);
			//sel.collapseToEnd();
		},

		/**
		 * Разбивает узел на два.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 * @param {Number} offset Смещение курсора относительно текущего узла.
		 * @return {Node} Новый узел, получившийся в результате разбивки.
		 */
		splitNode: function (els, nodes, offset)
		{
			var me = this,
				data = me.getData(),
				emptyElement = 'br';

			nodes.parentContainer = nodes.container.parentNode;
			els.parentContainer = nodes.parentContainer.getElement();
			els.container = nodes.container.getElement();

			while (els.parentContainer.elementId !== els.prevNode.elementId)
			{
				nodes.next = nodes.parentContainer.nextSibling;
				nodes.parent = nodes.parentContainer.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.nextContainer = nodes.container.nextSibling;

				// клонируем узел
				els.cloneContainer = els.parentContainer.clone({ignoredDeep: true});

				if (els.container.isText)
				{
					// часть текста после курсора
					els.endTextValue = nodes.container.nodeValue.substring(offset);

					// часть текста перед курсором
					els.startTextValue = nodes.container.nodeValue.substring(0, offset);

					if (!els.startTextValue)
					{
						// вставляем пустое содержимое вместо текущего узла
						els.empty = FBEditor.editor.Factory.createElement(emptyElement);
						els.parentContainer.replace(els.empty, els.container);
						nodes.parentContainer.replaceChild(els.empty.getNode(data.viewportId), nodes.container);
					}
					else
					{
						// изменяем текст текущего узла
						nodes.container.nodeValue = els.startTextValue;
						els.container.setText(els.startTextValue);
					}

					if (els.endTextValue.trim())
					{
						// добавляем текст
						els.t = FBEditor.editor.Factory.createElementText(els.endTextValue);
						els.cloneContainer.add(els.t);
					}

					nodes.cloneContainer = els.cloneContainer.getNode(data.viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.cloneContainer, els.next);
						nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
					}
					else
					{
						els.parent.add(els.cloneContainer);
						nodes.parent.appendChild(nodes.cloneContainer);
					}
				}
				else
				{
					nodes.cloneContainer = els.cloneContainer.getNode(data.viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.cloneContainer, els.next);
						nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
					}
					else
					{
						els.parent.add(els.cloneContainer);
						nodes.parent.appendChild(nodes.cloneContainer);
					}

					if (nodes.container.firstChild)
					{
						// если элемент не пустой, то переносим его в клонированный элемент
						els.cloneContainer.add(els.container);
						nodes.cloneContainer.appendChild(nodes.container);
					}
					else
					{
						// или просто удаляем
						nodes.parentContainer.removeChild(nodes.container);
					}
					els.parentContainer.remove(els.container);
				}

				// переносим все узлы после курсора
				nodes.parent = nodes.cloneContainer;
				els.parent = nodes.parent.getElement();
				while (nodes.nextContainer)
				{
					els.nextContainer = nodes.nextContainer.getElement();
					nodes.buf = nodes.nextContainer.nextSibling;

					els.parent.add(els.nextContainer);
					nodes.parent.appendChild(nodes.nextContainer);
					els.parentContainer.remove(els.nextContainer);

					nodes.nextContainer = nodes.buf;
				}

				if (!nodes.parent.firstChild && els.parent.xmlTag === 'p')
				{
					// добавляем пустое содержимое в параграф
					els.empty = FBEditor.editor.Factory.createElement(emptyElement);
					els.parent.add(els.empty);
					nodes.parent.appendChild(els.empty.getNode(data.viewportId));
				}

				// переносим указатель
				nodes.container = nodes.cloneContainer;
				els.container = nodes.container.getElement();

				nodes.parentContainer = nodes.container.parentNode;
				els.parentContainer = nodes.parentContainer.getElement();

			}

			return nodes.container;
		}
	}
);