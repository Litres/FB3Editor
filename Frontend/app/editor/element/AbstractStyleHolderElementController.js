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
				// сначала удаляем выделенную часть текста
				cmd = Ext.create('FBEditor.editor.command.' + name + '.RemoveRangeNodesCommand');
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
				//return false;
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
				range,
				node,
				next,
				offset;

			node = me.getSelectNode();
			next = node.nextSibling;
			next = next && next.nodeName === 'P' ? next : null;
			offset = sel.focusOffset;
			console.log('P del', node, next, node.lastChild.length, offset);
			if (next && me.isEmptyNode(node))
			{
				e.preventDefault();
				me.removeEmptyNode(node, 'next');

				return false;
			}
			else if (node.lastChild.length === offset)
			{
				e.preventDefault();
				if (next && next.nodeName === 'P')
				{
					if (me.isEmptyNode(next))
					{
						me.removeEmptyNode(next, 'prev');
					}
					else
					{
						if (next.firstChild.nodeType === Node.TEXT_NODE)
						{
							me.joinTextToNextNode(node);
						}
						else
						{
							me.textToNextNode(node);
						}
					}
				}

				return false;
			}
			else if (me.isEmptyNode(node))
			{
				e.preventDefault();

				return false;
			}

			return true;
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				prev;

			range = sel.getRangeAt(0);
			node = me.getSelectNode();
			//node = range.startContainer;
			prev = node.previousSibling;
			prev = prev && prev.nodeName === 'P' ? prev : null;
			console.log('P back', node, prev, me.isEmptyNode(node));
			if (prev && me.isEmptyNode(node))
			{
				e.preventDefault();
				me.removeEmptyNode(node, 'prev');

				return false;
			}
			else if (range.startOffset === 0)
			{
				e.preventDefault();
				if (prev && prev.nodeName === 'P')
				{
					if (me.isEmptyNode(prev))
					{
						me.removeEmptyNode(prev, 'next');
					}
					else
					{
						if (prev.lastChild.nodeType === Node.TEXT_NODE)
						{
							me.joinTextToPrevNode(node);
						}
						else
						{
							me.textToPrevNode(node);
						}
					}
				}

				return false;
			}
			else if (me.isEmptyNode(node))
			{
				e.preventDefault();

				return false;
			}

			return true;
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
		 * @protected
		 * Добавляет пустой абзац.
		 * @param {Node} node Узел, после которого добавится пустой абзац.
		 */
		appendEmptyNode: function (node)
		{
			var me = this,
				name = me.getNameElement(),
				cmd;

			cmd = Ext.create('FBEditor.editor.command.' + name + '.AppendEmptyNodeCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
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