/**
 * Кнотроллер элемента p.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.p.PElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDownCtrlEnter: function (e)
		{
			var me = this,
				node,
				parent,
				el;

			e.preventDefault();
			node = me.getSelectNode();
			parent = node.parentNode;
			el = parent.getElement ? parent.getElement() : null;
			console.log('P ctrl+enter', node, el);
			if (el)
			{
				el.fireEvent('insertElement', parent);
			}

			return false;
		},

		onKeyDownEnter: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent;

			e.preventDefault();
			range = sel.getRangeAt(0);
			node = range.startContainer;
			parent = node.parentNode;
			console.log('P enter', node, range.startOffset);
			if (node.nodeType === Node.TEXT_NODE)
			{
				me.splitNode(node, range.startOffset);
				sel.collapse(parent.nextSibling);
			}
			else
			{
				me.appendEmptyNode(node);
				sel.collapse(node);
			}

			return false;
		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				next,
				offset;

			range = sel.getRangeAt(0);
			node = me.getSelectNode();
			next = node.nextSibling;
			next = next && next.nodeName === 'P' ? next : null;
			offset = range.startOffset;
			console.log('P del', node, next);
			if (next && me.isEmptyNode(node))
			{
				e.preventDefault();
				me.removeEmptyNode(node);
				sel.collapse(next);

				return false;
			}
			else if (node.firstChild.length === offset)
			{
				e.preventDefault();
				if (next && next.nodeName === 'P')
				{
					if (me.isEmptyNode(next))
					{
						me.removeEmptyNode(next);
					}
					else
					{
						if (next.firstChild.nodeType === Node.TEXT_NODE)
						{
							me.moveJoinTextToNextNode(node);
						}
						else
						{
							me.moveTextToNextNode(node);
						}
						sel.extend(next.firstChild, offset);
						sel.collapseToEnd();
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
				prev,
				offset;

			range = sel.getRangeAt(0);
			node = me.getSelectNode();
			prev = node.previousSibling;
			prev = prev && prev.nodeName === 'P' ? prev : null;
			console.log('P back', node, prev, me.isEmptyNode(node));
			if (prev && me.isEmptyNode(node))
			{
				e.preventDefault();
				offset = prev.firstChild.length;
				me.removeEmptyNode(node);
				sel.collapse(prev.firstChild);
				sel.extend(prev.firstChild, offset);
				sel.collapseToEnd();

				return false;
			}
			else if (range.startOffset === 0)
			{
				e.preventDefault();
				if (prev && prev.nodeName === 'P')
				{
					if (me.isEmptyNode(prev))
					{
						me.removeEmptyNode(prev);
					}
					else
					{
						// сохраняем необходимое смещение курсора
						offset = prev.firstChild.length;

						if (prev.firstChild.nodeType === Node.TEXT_NODE)
						{
							me.moveJoinTextToPrevNode(node);
						}
						else
						{
							me.moveTextToPrevNode(node);
						}
						sel.extend(prev.firstChild, offset);
						sel.collapseToStart();
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
			return node.firstChild.nodeName === 'BR' && node.childNodes.length === 1;
		},

		/**
		 * @protected
		 * Разбивает абзац на два.
		 * @param {Node} node Узел p.
		 * @param {Number} offset Позиция курсора, в которой происходит разделение текста.
		 */
		splitNode: function (node, offset)
		{
			var parent = node.parentNode,
				next = parent.nextSibling,
				start,
				end,
				p;

			start = offset ?
			        document.createTextNode(node.nodeValue.substring(0, offset)) :
			        document.createElement('br');
			end = offset !== node.length ?
			      document.createTextNode(node.nodeValue.substring(offset)) :
			      document.createElement('br');
			console.log('split', node, parent, next, start, end);
			p = document.createElement('p');
			if (next)
			{
				parent.parentNode.insertBefore(p, next);
			}
			else
			{
				parent.parentNode.appendChild(p);
			}
			p.appendChild(end);
			parent.replaceChild(start, node);
		},

		/**
		 * @protected
		 * Добавляет пустой абзац.
		 * @param {Node} node Узел p, после которого добавится пустой абзац.
		 */
		appendEmptyNode: function (node)
		{
			var parent = node.parentNode,
				els = {};

			els.p = document.createElement('p');
			parent.insertBefore(els.p, node);
			els.br = document.createElement('br');
			els.p.appendChild(els.br);
		},

		/**
		 * @protected
		 * Удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		removeEmptyNode: function (node)
		{
			var parent = node.parentNode;

			parent.removeChild(node);
		},

		/**
		 * @protected
		 * Перемещает текстовый узел абзаца в конец предыдущего абзаца и удаляет пустой абзац
		 * @param {Node} node Узел p.
		 */
		moveTextToPrevNode: function (node)
		{
			var parent = node.parentNode,
				prev = node.previousSibling;

			prev.appendChild(node.firstChild);
			parent.removeChild(node);
		},

		/**
		 * @protected
		 * Перемещает текстовый узел абзаца в начало следующего абзаца и удаляет пустой абзац
		 * @param {Node} node Узел p.
		 */
		moveTextToNextNode: function (node)
		{
			var parent = node.parentNode,
				next = parent.nextSibling;

			parent.removeChild(node);
			next.insertBefore(node.firstChild, next.firstChild);
		},

		/**
		 * @protected
		 * Перемещает объединенный текстовый узел абзаца с текстом предыдущего абзаца в конец предыдущего абзаца
		 * и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		moveJoinTextToPrevNode: function (node)
		{
			var parent = node.parentNode,
				prev = node.previousSibling,
				text;

			text = document.createTextNode(prev.firstChild.nodeValue + node.firstChild.nodeValue);
			prev.replaceChild(text, prev.firstChild);
			parent.removeChild(node);
		},

		/**
		 * @protected
		 * Перемещает объединенный текстовый узел абзаца с текстом следующего абзаца в начало следующего абзаца
		 * и удаляет пустой абзац.
		 * @param {Node} node Узел p.
		 */
		moveJoinTextToNextNode: function (node)
		{
			var parent = node.parentNode,
				next = parent.nextSibling,
				text;

			text = document.createTextNode(node.firstChild.nodeValue + next.firstChild.nodeValue);
			parent.removeChild(node);
			next.replaceChild(text, next.firstChild);
		}
	}
);