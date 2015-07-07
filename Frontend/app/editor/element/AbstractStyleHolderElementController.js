/**
 * Абстрактный контроллер элемента содержажащего в себе стилевые элементы.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDownEnter: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				cmd,
				range;

			e.preventDefault();

			range = sel.getRangeAt(0);

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}

			// разбиваем элемент на два в позиции курсора
			cmd = Ext.create('FBEditor.editor.command.' + name + '.SplitNodeCommand');
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}

			return false;

		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				cmd,
				range,
				isEnd;

			e.preventDefault();

			range = sel.getRangeAt(0);

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			nodes.p = nodes.node.parentNode;
			els.p = nodes.p.getElement();

			if (els.node.isEmpty() && nodes.node.firstChild)
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в конце элемента?
			isEnd = range.startOffset === els.node.getText().length;

			//console.log('range, isEnd, nodes', range, isEnd, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();
			}

			// следующий за текущим
			nodes.next = nodes.node.nextSibling;

			//console.log('range, isEnd, nodes', range, isEnd, nodes);

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isEnd && !nodes.next)
			{
				// курсор в конце параграфа

				// соединяем параграф со следующим
				cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinNextNodeCommand');
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				nodes.text = isEnd ? nodes.next : nodes.node;
				nodes.text = manager.getDeepFirst(nodes.text);

				// ставим курсор в текст
				manager.setCursor(
					{
						startNode: nodes.text,
						startOffset: isEnd ? 0 : range.startOffset
					}
				);

				// передаем событие текстовому элементу
				nodes.text.getElement().fireEvent('keyDownDelete', e);
			}
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				cmd,
				range,
				isStart;

			e.preventDefault();

			range = sel.getRangeAt(0);

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			nodes.p = nodes.node.parentNode;
			els.p = nodes.p.getElement();

			if (els.node.isEmpty() && nodes.node.firstChild)
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в начале элемента?
			isStart = range.startOffset === 0;

			//console.log('range, isStart, nodes', range, isStart, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();
			}

			// элемент перед текущим в параграфе
			nodes.prev = nodes.node.previousSibling;

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isStart && !nodes.prev)
			{
				// курсор в начале параграфа

				// соединяем параграф с предыдущим
				cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinPrevNodeCommand');
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				nodes.text = isStart ? nodes.prev : nodes.node;
				nodes.text = manager.getDeepLast(nodes.text);
				els.text = nodes.text.getElement();

				// ставим курсор в текст
				manager.setCursor(
					{
						startNode: nodes.text,
						startOffset: isStart ? els.text.getText().length : range.startOffset - 1
					}
				);

				// передаем событие текстовому элементу
				nodes.text.getElement().fireEvent('keyDownBackspace', e);
			}
		},

		/**
		 * Удаляет выделенную часть текста.
		 */
		removeRangeNodes: function ()
		{
			var me = this,
				name = me.getNameElement(),
				cmd;

			cmd = Ext.create('FBEditor.editor.command.' + name + '.RemoveRangeNodesCommand');
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		/**
		 * Возвращает выделенный узел p.
		 * @return {Node} Узел p.
		 */
		getSelectNode: function ()
		{
			var sel = window.getSelection(),
				range,
				node;

			range = sel.getRangeAt(0);
			node = range.startContainer;
			node = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;

			return node;
		},

		/**
		 * @protected
		 * Пустой ли абзац.
		 * @param {Node} node Узел p.
		 * @returns {Boolean} Пустой ли абзац.
		 */
		isEmptyNode: function (node)
		{
			return node.nodeName === 'P' && node.firstChild.nodeName === 'BR' && node.childNodes.length === 1;
		},

		/**
		 * @protected
		 * Удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 * @param {String} sibling Соседний узел p (prev, next).
		 */
		removeEmptyNode: function (node, sibling)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.p.RemoveEmptyNodeCommand', {node: node, sibling: sibling});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		/**
		 * @protected
		 * Перемещает текстовый узел абзаца в конец предыдущего абзаца и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		textToPrevNode: function (node)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.p.TextToPrevNodeCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
			/*var parent = node.parentNode,
			 prev = node.previousSibling;

			 prev.appendChild(node.firstChild);
			 parent.removeChild(node);*/
		},

		/**
		 * @protected
		 * Перемещает текстовый узел абзаца в начало следующего абзаца и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		textToNextNode: function (node)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.p.TextToNextNodeCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		/**
		 * @protected
		 * Перемещает объединенный текстовый узел абзаца с текстом предыдущего абзаца в конец предыдущего абзаца
		 * и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		joinTextToPrevNode: function (node)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.p.JoinTextToPrevNodeCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		/**
		 * @protected
		 * Перемещает объединенный текстовый узел абзаца с текстом следующего абзаца в начало следующего абзаца
		 * и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		joinTextToNextNode: function (node)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.p.JoinTextToNextNodeCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);