/**
 * Вставляет данные из буфера обмена.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.PasteCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				offset = {},
				pos = {},
				sel = window.getSelection(),
				manager = FBEditor.editor.Manager,
				isEnd,
				range;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанваливаем выделение
					manager.setCursor(data.saveRange);
				}

				range = sel.getRangeAt(0);

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					collapsed: range.collapsed,
					offset: offset
				};

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();

				data.viewportId = nodes.node.viewportId;

				// корневой узел из буфера обмена
				nodes.paste = data.html.querySelector('body');

				console.log('paste', nodes.paste, data);

				// создаем элемент из скопированного узла
				els.paste = manager.createElementFromNode(nodes.paste);

				// фрагмент для хранения вставляемых элементов
				els.fragment = FBEditor.editor.Factory.createElement('div');

				// помещаем во фрагмент только стилевые элементы и их контейнеры
				els.paste.getOnlyStylesChildren(els.fragment);

				// TODO проверяем по схеме каждый элемент, и если он не проходит проверку, то преобразуем его в текст

				// узел скопированного фрагмента
				nodes.fragment = els.fragment.getNode(data.viewportId);

				if (els.node.isEmpty())
				{
					// позиция курсора в пустом параграфе

					if (els.fragment.children[0].isStyleHolder)
					{
						// параграф
						while (!els.node.isStyleHolder)
						{
							nodes.node = nodes.node.parentNode;
							els.node = nodes.node.getElement();
						}
					}
					else
					{
						// пустой элемент
						nodes.node = manager.getDeepFirst(nodes.node);
						els.node = nodes.node.getElement();
					}
				}
				else
				{
					// делим узел в позиции курсора

					if (els.fragment.children[0].isStyleHolder)
					{
						// делим на уровне параграфов

						while (!els.node.isStyleHolder)
						{
							nodes.node = nodes.node.parentNode;
							els.node = nodes.node.getElement();
						}

						// находится ли курсор в конце параграфа
						pos.isEnd = manager.isLastNode(nodes.node, range.startContainer) &&
						        range.startContainer.nodeValue.length === offset.start;

						// находится ли курсор в начале параграфа
						pos.isStart = manager.isFirstNode(nodes.node, range.startContainer) && offset.start === 0;
					}
					else
					{
						// делим узел на уровне стилевых элементов

						nodes.node = range.startContainer;
						els.node = nodes.node.getElement();

						// находится ли курсор в конце элемента
						pos.isEnd = els.node.text.length === offset.start;

						// находится ли курсор в начале элемента
						pos.isStart = offset.start === 0;
					}

					//console.log('pos', pos); //return false;

					if (pos.isStart)
					{
						// если курсор в начале элемента

						//nodes.node = nodes.node;
					}
					else if (pos.isEnd)
					{
						// если курсор в конце элемента

						if (nodes.node.nextSibling)
						{
							// указатель на следующий элемент
							nodes.node = nodes.node.nextSibling;
						}
						else
						{
							// добавляем временно пустой элемент в конец и переносим на него указатель
							// после переноса фрагмента пустой элемент будет удален

							nodes.parent = nodes.node.parentNode;
							els.parent = nodes.parent.getElement();

							els.node = manager.createEmptyElement();
							nodes.node = els.node.getNode(data.viewportId);

							els.parent.add(els.node);
							nodes.parent.appendChild(nodes.node);
						}
					}
					else
					{
						// делим элемента, если курсор не в конце и не в начале элемента

						nodes.container = range.startContainer;
						nodes.common = nodes.node.parentNode;
						els.common = nodes.common.getElement();
						nodes.node = manager.splitNode(els, nodes, offset.start);
						els.common.removeEmptyText();
					}
				}

				//console.log('nodes', nodes); return false;

				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// ссылки на первый и последний элементы фрагмента
				nodes.fragmentFirst = nodes.fragment.firstChild;
				nodes.fragmentLast = nodes.fragment.lastChild;
				els.fragmentFirst = nodes.fragmentFirst.getElement();
				els.fragmentLast = nodes.fragmentLast.getElement();

				// переносим все элементы из фрагмента в текст
				nodes.first = nodes.fragment.firstChild;
				els.first = nodes.first.getElement();
				while (nodes.first)
				{
					els.first = nodes.first.getElement();
					els.parent.insertBefore(els.first, els.node);
					nodes.parent.insertBefore(nodes.first, nodes.node);
					nodes.first = nodes.fragment.firstChild;
				}

				// соединяем соседние текстовые узлы
				nodes.prev = nodes.fragmentFirst.previousSibling;
				els.prev = nodes.prev ? nodes.prev.getElement() : null;
				nodes.next = nodes.fragmentLast.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;
				if (els.prev && els.prev.isText && els.next && els.next.isText && els.fragmentFirst.isText &&
				    els.fragmentFirst.elementId === els.fragmentLast.elementId)
				{
					// соединяем текстовый узел фрагмента с соседними текстовыми узлами

					nodes.cursor = nodes.prev;
					offset.cursor = els.prev.text.length + els.fragmentFirst.text.length;

					els.textValue = els.prev.text + els.fragmentFirst.text + els.next.text;
					els.prev.setText(els.textValue);
					nodes.prev.nodeValue = els.textValue;

					els.parent.remove(els.fragmentFirst);
					nodes.parent.removeChild(nodes.fragmentFirst);
					els.parent.remove(els.next);
					nodes.parent.removeChild(nodes.next);
					els.next = null;
				}
				else if (els.prev && els.prev.isText && els.fragmentFirst.isText)
				{
					// соединяем первый узел фрагмента

					els.textValue = els.prev.text + els.fragmentFirst.text;
					els.prev.setText(els.textValue);
					nodes.prev.nodeValue = els.textValue;

					els.parent.remove(els.fragmentFirst);
					nodes.parent.removeChild(nodes.fragmentFirst);

					nodes.cursor = nodes.fragmentLast.parentNode ? nodes.fragmentLast : nodes.prev;
				}
				if (els.next && els.next.isText && els.fragmentLast.isText)
				{
					// соединяем последний узел фрагмента

					els.textValue = els.fragmentLast.text + els.next.text;
					els.next.setText(els.textValue);
					nodes.next.nodeValue = els.textValue;

					els.parent.remove(els.fragmentLast);
					nodes.parent.removeChild(nodes.fragmentLast);

					nodes.cursor = nodes.next;
					offset.cursor = els.fragmentLast.text.length;
				}

				if (els.node.isEmpty())
				{
					// удаляем пустой элемент
					els.parent.remove(els.node);
					nodes.parent.removeChild(nodes.node);
				}

				//console.log('nodes, els', nodes, els);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = nodes.cursor || manager.getDeepLast(nodes.fragmentLast);
				offset.cursor = offset.cursor ? offset.cursor :
				                (nodes.cursor.nodeValue ? nodes.cursor.nodeValue.length : 0);
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: offset.cursor
					}
				);

				// сохраняем
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

				return false;

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