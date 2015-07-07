/**
 * Удаляет пустой элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.text.DeleteEmptyCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				containers,
				range;

			try
			{
				containers = manager.getStyleContainers();

				if (data.saveRange)
				{
					// восстанваливаем выделение
					manager.setCursor(data.saveRange);
				}

				range = sel.getRangeAt(0);

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();

				data.viewportId = nodes.node.viewportId;

				console.log('del empty', range);

				manager.suspendEvent = true;

				data.oldValue = els.node.getText();
				els.node.setText('');
				nodes.node.nodeValue = '';

				nodes.empty = nodes.node;
				els.empty = nodes.empty.getElement();
				nodes.parentEmpty = nodes.empty.parentNode;
				els.parentEmpty = nodes.parentEmpty.getElement();

				if (els.parentEmpty.isEmpty() && Ext.Array.contains(containers, els.parentEmpty.xmlTag))
				{
					//console.log('relocate');
					nodes.empty = nodes.parentEmpty;
					els.empty = nodes.empty.getElement();
					nodes.parentEmpty = nodes.parentEmpty.parentNode;
					els.parentEmpty = nodes.parentEmpty.getElement();
				}

				nodes.cursorStart = 0;

				//console.log('nodes, els', nodes, els);

				if (!Ext.Array.contains(containers, els.empty.xmlTag))
				{
					// ищем самый верхний пустой элемент
					while (els.parentEmpty.isEmpty() && !Ext.Array.contains(containers, els.parentEmpty.xmlTag))
					{
						//console.log('search', els.parentEmpty.xmlTag);
						nodes.empty = nodes.parentEmpty;
						els.empty = nodes.empty.getElement();
						nodes.parentEmpty = nodes.parentEmpty.parentNode;
						els.parentEmpty = nodes.parentEmpty.getElement();
					}

					if (Ext.Array.contains(containers, els.parentEmpty.xmlTag) && els.parentEmpty.isEmpty())
					{
						//console.log('p');
						nodes.empty = nodes.parentEmpty;
						els.empty = nodes.empty.getElement();
						nodes.parentEmpty = nodes.parentEmpty.parentNode;
						els.parentEmpty = nodes.parentEmpty.getElement();
					}
				}

				if (!Ext.Array.contains(containers, els.empty.xmlTag))
				{
					// удаляем пустой элемент

					//console.log('remove')
					nodes.next = nodes.empty.nextSibling;
					nodes.prev = nodes.empty.previousSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;
					els.prev = nodes.prev ? nodes.prev.getElement() : null;

					els.parentEmpty.remove(els.empty);
					nodes.parentEmpty.removeChild(nodes.empty);

					// курсор
					nodes.cursor = nodes.next ? manager.getDeepFirst(nodes.next) : manager.getDeepLast(nodes.prev);
					nodes.cursorStart = nodes.next ? 0 : nodes.cursor.nodeValue.length;

					// объединяем два соседних текстовых узла
					if (els.next && els.prev && els.next.isText && els.prev.isText)
					{
						nodes.cursor = nodes.prev;
						nodes.cursorStart = nodes.prev.nodeValue.length;
						manager.joinNode(nodes.next);
						nodes.needSplit = true;
					}
				}
				else
				{
					// вставляем в параграф пустой элемент

					//console.log('insert');

					els.newEmpty = manager.createEmptyElement();
					nodes.newEmpty = els.newEmpty.getNode(data.viewportId);

					nodes.first = nodes.empty.firstChild;
					if (nodes.first)
					{
						els.first = nodes.first.getElement();
						els.empty.replace(els.newEmpty, els.first);
						nodes.empty.replaceChild(nodes.newEmpty, nodes.first);
					}
					else
					{
						els.empty.add(els.newEmpty);
						nodes.empty.appendChild(nodes.newEmpty);
					}

					els.parentEmpty = els.empty;
					nodes.parentEmpty = nodes.empty;
					els.empty = els.first;
					nodes.cursor = nodes.newEmpty;
				}

				els.parentEmpty.removeEmptyText();

				//console.log('nodes, els', nodes, els);

				els.parentEmpty.sync(data.viewportId);

				manager.suspendEvent = false;

				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.cursorStart
					}
				);

				data.els = els;
				data.nodes = nodes;

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
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				sel,
				restoreRange;

			try
			{
				manager.suspendEvent = true;

				nodes = data.nodes;
				els = data.els;

				// восстанавливаем узел
				nodes.empty = els.empty.getNode(data.viewportId);

				console.log('undo del empty', nodes, els);
				//return false;

				if (nodes.newEmpty)
				{
					// вставляем вместо пустого
					els.parentEmpty.replace(els.empty, els.newEmpty);
					nodes.parentEmpty.replaceChild(nodes.empty, nodes.newEmpty);
				}
				else
				{
					if (nodes.needSplit)
					{
						// разбиваем текстовый узел

						els.prevValue = els.prev.text.substring(0, nodes.cursorStart);

						els.prev.setText(els.prevValue);
						nodes.prev.nodeValue = els.prevValue;

						nodes.next = els.next.getNode(data.viewportId);
						nodes.nextNext = nodes.prev.nextSibling;

						if (nodes.nextNext)
						{
							els.nextNext = nodes.nextNext.getElement();
							els.parentEmpty.insertBefore(els.next, els.nextNext);
							nodes.parentEmpty.insertBefore(nodes.next, nodes.nextNext);
						}
						else
						{
							els.parentEmpty.add(els.next);
							nodes.parentEmpty.appendChild(nodes.next);
						}
					}

					if (nodes.next)
					{
						// вставляем перед

						// действительна ли родительская ссылка
						nodes.parent = nodes.next.parentNode;
						els.parent = nodes.parent ? nodes.parent.getElement() : null;
						while (els.parent && !els.parent.isRoot)
						{
							nodes.parent = nodes.parent.parentNode;
							els.parent = nodes.parent ? nodes.parent.getElement() : null;
						}

						if (!els.parent || !els.parent.isRoot)
						{
							// восстанавливаем ссылку из выделения
							sel = window.getSelection();
							restoreRange = sel.getRangeAt(0);
							nodes.next = restoreRange.startContainer;
							els.next = nodes.next.getElement();
							nodes.parent = nodes.next.parentNode;
							els.parent = nodes.parent ? nodes.parent.getElement() : null;
							while (els.parent && !els.parent.hisName(els.parentEmpty.xmlTag))
							{
								nodes.next = nodes.parent;
								els.next = els.parent;
								nodes.parent = nodes.parent.parentNode;
								els.parent = nodes.parent ? nodes.parent.getElement() : null;
							}
							nodes.parentEmpty = nodes.parent;
							els.parentEmpty = els.parent;
							//console.log('restore', nodes.next);
						}

						els.parentEmpty.insertBefore(els.empty, els.next);
						nodes.parentEmpty.insertBefore(nodes.empty, nodes.next);
					}
					else
					{
						// добавляем в конец
						els.parentEmpty.add(els.empty);
						nodes.parentEmpty.appendChild(nodes.empty);
					}
				}

				// исходный текст
				nodes.deep = manager.getDeepFirst(nodes.empty);
				els.deep = nodes.deep.getElement();
				if (els.deep.isText)
				{
					els.deep.setText(data.oldValue);
					nodes.deep.nodeValue = data.oldValue;
					nodes.cursor = nodes.deep;
				}
				else
				{
					els.text = factory.createElementText(data.oldValue);
					nodes.text = els.text.getNode(data.viewportId);
					els.deep.add(els.text);
					nodes.deep.appendChild(nodes.text);
					nodes.cursor = nodes.text;
				}

				els.parentEmpty.sync(data.viewportId);

				manager.suspendEvent = false;

				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: data.isBackspace ? 1 : 0
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