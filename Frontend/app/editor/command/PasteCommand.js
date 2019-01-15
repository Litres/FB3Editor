/**
 * Вставляет данные из буфера обмена.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.PasteCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',
		requires: [
			'FBEditor.editor.pasteproxy.PasteProxy'
		],

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				e = data.e,
				res = false,
				nodes = {},
				els = {},
				offset = {},
				pos = {},
				sel,
				range,
				proxy;

			try
			{
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				nodes.node = range.start;
				els.node = nodes.node.getElement();
				els.p = els.node.getStyleHolder();

				if (!range.collapsed)
				{
					// удаляем выделенную часть текста
					els.p.removeRangeNodes();
				}

				if (data.saveRange)
				{
					// восстанваливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}
				
				sel = window.getSelection();
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

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				data.viewportId = nodes.node.viewportId;

				// прокси данных из буфера
				proxy = data.proxy || Ext.create('FBEditor.editor.pasteproxy.PasteProxy', {e: e, manager: manager});

				// получаем модель вставляемого фрагмента
				els.fragment = data.proxy ? proxy.getCreateModel() : proxy.getModel();

				//Ext.log({level: 'info', msg: 'Фрагмент', dump: els.fragment});

				data.proxy = proxy;
				els.fragP = els.fragment.first();

				if (!els.fragP)
				{
					// пустая вставка
					return true;
				}

				// проверяем корректность вставки в текущий элемент
				me.checkPasteIntoEl(els);

				if (els.fragP.isStyleHolder && els.fragment.children.length === 1 && !els.node.isEmpty())
				{
					// если вставляемая модель содержит только один абзац,
					// то вставляем его содержимое в текущий абзац

					els.next = els.fragP.first();

					while (els.next)
					{
						els.temp = els.next.next();
						els.fragment.add(els.next);
						els.next = els.temp;
					}

					els.fragment.remove(els.fragP);
				}

				// узел скопированного фрагмента
				nodes.fragment = els.fragment.getNode(data.viewportId);

				if (els.node.isEmpty())
				{
					// позиция курсора в пустом параграфе

					els.fragP = els.fragment.first();
					nodes.needEmpty = true;
					
					if (els.fragP && els.fragP.isBlock())
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

					els.fragF = els.fragment.first();

					if (!els.fragF.isImg &&
					    (els.fragF.isStyleHolder ||
					    !els.fragF.isStyleType && !els.fragF.isText))
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
						// делим элемент, если курсор не в конце и не в начале элемента

						nodes.needJoin = true;
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
				    els.fragmentFirst.equal(els.fragmentLast))
				{
					// соединяем текстовый узел фрагмента с соседними текстовыми узлами

					nodes.needReplaceText = els.prev.text + els.next.text;

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

					nodes.needSplitFirst = true;

					els.textValue = els.prev.text + els.fragmentFirst.text;
					els.prev.setText(els.textValue);
					nodes.prev.nodeValue = els.textValue;

					els.parent.remove(els.fragmentFirst);
					nodes.parent.removeChild(nodes.fragmentFirst);

					nodes.cursor = nodes.fragmentLast.parentNode ? manager.getDeepLast(nodes.fragmentLast) : nodes.prev;
				}

				if (els.next && els.next.isText && els.fragmentLast.isText)
				{
					// соединяем последний узел фрагмента

					nodes.needSplitLast = true;

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

				manager.setSuspendEvent(false);

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
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parent);

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
				nodes = {},
				els = {},
				res = false,
				factory = FBEditor.editor.Factory,
				paste = FBEditor.resource.Manager.getPaste(),
				helper,
				manager,
				range;

			try
			{
				range = data.range;
				nodes = data.nodes;
				els = data.els;

				nodes.cursor = range.start;

				manager = els.parent.getManager();
				manager.setSuspendEvent(true);
				helper = els.fragmentFirst.getNodeHelper();
				nodes.fragmentFirst = helper.getNode(data.viewportId);

				console.log('undo paste', nodes, els, range);

				if (nodes.needReplaceText)
				{
					// заменяем вставленный текст на старый
					els.prev.setText(nodes.needReplaceText);
					nodes.prev.nodeValue = nodes.needReplaceText;
					nodes.cursor = nodes.prev;

					els.prev.sync(data.viewportId);
				}
				else
				{
					// удаляем вставленный фрагмент

					if (nodes.needSplitFirst)
					{
						// разбиваем первый текстовый узел
						els.startTextValue = els.prev.text.substring(0, range.offset.start);
						els.endTextValue = els.prev.text.substring(range.offset.start);

						els.t = factory.createElementText(els.startTextValue);
						nodes.t = els.t.getNode(data.viewportId);
						nodes.fragmentFirst = nodes.prev;
						els.fragmentFirst = els.prev;
						els.fragmentFirst.setText(els.endTextValue);
						nodes.fragmentFirst.nodeValue = els.endTextValue;

						els.parent.insertBefore(els.t, els.fragmentFirst);
						nodes.parent.insertBefore(nodes.t, nodes.fragmentFirst);

						nodes.cursor = nodes.t;
					}

					if (nodes.needSplitLast)
					{
						// разбиваем последний текстовый узел
						els.startTextValue = els.next.text.substring(0, range.offset.cursor);
						els.endTextValue = els.next.text.substring(range.offset.cursor);

						els.fragmentLast = factory.createElementText(els.startTextValue);
						nodes.fragmentLast = els.fragmentLast.getNode(data.viewportId);

						els.next.setText(els.endTextValue);
						nodes.next.nodeValue = els.endTextValue;

						els.parent.insertBefore(els.fragmentLast, els.next);
						nodes.parent.insertBefore(nodes.fragmentLast, nodes.next);
					}

					nodes.next = nodes.fragmentFirst;
					els.next = nodes.next.getElement();

					while (els.next && !els.next.equal(els.fragmentLast))
					{
						nodes.buf = nodes.next.nextSibling;
						els.parent.remove(els.next);
						nodes.parent.removeChild(nodes.next);
						nodes.next = nodes.buf;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}

					if (els.next)
					{
						els.parent.remove(els.next);
						nodes.parent.removeChild(nodes.next);
					}

					if (nodes.needJoin)
					{
						// соединяем узлы
						manager.joinNode(nodes.node);
					}

					if (nodes.needEmpty)
					{
						// вставляем пустой узел
						els.parent.add(els.node);
						nodes.parent.appendChild(nodes.node);
					}

					els.parent.sync(data.viewportId);
				}

				manager.setSuspendEvent(true);

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start
				};
				manager.setCursor(data.saveRange);
				
				// удаляем вставленные ресурсы
				paste.remove();

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			return res;
		},

		/**
		 * Проверяет корректность вставки в текущий элемент при необходимотси корректирует вставку.
		 * @param {Object} els
		 */
		checkPasteIntoEl: function (els)
		{
			var me = this;

			els.fragment.each(
				function (el)
				{
					if (els.node.hasParentName('div') && el.hisName('div'))
					{
						// убираем вложенность блоков
						el.upChildren();
					}
				}
			);
		}
	}
);