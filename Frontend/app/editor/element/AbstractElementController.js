/**
 * Класс абстрактного контроллера элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElementController',
	{
		/**
		 * @property {FBEditor.editor.element.AbstractElement} Элемент контроллера.
		 */
		el: null,

		/**
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент контроллера.
		 */
		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * Нажатие кнопки клавиатуры.
		 * @param {Event} e Объект события.
		 */
		onKeyDown: function (e)
		{
			var me = this,
				focusNode,
				el,
				controller;

			e.stopPropagation();
			focusNode = me.getFocusNode(e.target);
			if (focusNode)
			{
				el = focusNode.getElement ? focusNode.getElement() : null;
				controller = el && el.controller ? el.controller : me;
				switch (e.keyCode)
				{
					case Ext.event.Event.ENTER:
						return controller.onKeyDownEnter(e);
					case Ext.event.Event.DELETE:
						return controller.onKeyDownDelete(e);
					case Ext.event.Event.BACKSPACE:
						return controller.onKeyDownBackspace(e);
				}
			}

		},

		onKeyDownEnter: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				startText,
				endText,
				br;

			if (sel.type === 'Caret')
			{
				e.preventDefault();
				range = sel.getRangeAt(0);
				node = range.endContainer;
				parent = node.parentNode;
				br = document.createElement('br');
				console.log(node);
				if (node.nodeType === Node.TEXT_NODE)
				{
					startText = document.createTextNode(node.nodeValue.substring(0, range.startOffset));
					endText = document.createTextNode(node.nodeValue.substring(range.startOffset));
					parent.removeChild(node);
					parent.appendChild(startText);
					parent.appendChild(br);
					parent.appendChild(endText);
				}
				else
				{
					parent.appendChild(br);
				}

				return false;
			}

			return true;
		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				next,
				text,
				offset;

			if (sel.type === 'Caret')
			{
				range = sel.getRangeAt(0);
				node = range.endContainer;
				offset = range.endOffset;
				if (node.length === offset)
				{
					e.preventDefault();
					parent = node.parentNode;
					next = parent.nextSibling;
					if (next && parent.nodeType === next.nodeType)
					{
						if (next.firstChild.nodeType === Node.TEXT_NODE)
						{
							text = document.createTextNode(node.nodeValue + next.firstChild.nodeValue);
							parent.parentNode.removeChild(parent);
							next.replaceChild(text, next.firstChild);
						}
						else
						{
							parent.parentNode.removeChild(parent);
							next.insertBefore(node, next.firstChild);
						}
						sel.extend(next.firstChild, offset);
						sel.collapseToEnd();
					}

					return false;
				}
			}

			return true;
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				prev,
				text,
				offset;

			if (sel.type === 'Caret')
			{
				range = sel.getRangeAt(0);
				node = range.startContainer;
				if (range.startOffset === 0)
				{
					console.log('range', range);
					parent = node.parentNode;
					prev = parent.previousSibling;
					if (prev && parent.nodeType === prev.nodeType)
					{
						e.preventDefault();
						offset = prev.firstChild.length;
						if (prev.firstChild.nodeType === Node.TEXT_NODE)
						{
							text = document.createTextNode(prev.firstChild.nodeValue + node.nodeValue);
							prev.replaceChild(text, prev.firstChild);
						}
						else
						{
							prev.appendChild(node);
						}
						parent.parentNode.removeChild(parent);
						console.log(prev.firstChild, offset);
						sel.extend(prev.firstChild, offset);
						sel.collapseToStart();
					}

					return false;
				}
			}

			return true;
		},

		/**
		 * Отпускание кнопки клавиатуры определяет элемент, на котором находится курсор.
		 * @param {Event} e Объект события.
		 */
		onKeyUp: function (e)
		{
			var me = this,
				focusNode,
				focusElement;

			focusNode = me.getFocusNode(e.target);
			focusElement = focusNode.getElement();
			console.log('keyup: focusNode, focusElement', e, focusNode, focusElement);
			FBEditor.editor.Manager.setFocusElement(focusElement);
			e.stopPropagation();

			return false;
		},

		/**
		 * Отпускание кнопки мыши определяет элемент, на котором находится фокус.
		 * @param {Event} e Объект события.
		 */
		onMouseUp: function (e)
		{
			var me = this,
				focusNode,
				focusElement;

			focusNode = me.getFocusNode(e.target);
			focusElement = focusNode.getElement();
			//console.log('mouseup: focusNode, focusElement', e, focusNode, focusElement);
			FBEditor.editor.Manager.setFocusElement(focusElement);
			e.stopPropagation();

			return false;
		},

		/**
		 * Вставка нового узла.
		 * @param {Event} e Объект события.
		 */
		onNodeInserted: function (e)
		{
			var me = this,
				relNode = e.relatedNode,
				node = e.target,
				viewportId = relNode.viewportId,
				newEl,
				nextSibling,
				previousSibling,
				parentEl,
				nextSiblingEl;

			// игнориуруется вставка корневого узла, так как он уже вставлен и
			// игнорируется вставка при включенной заморозке
			if (relNode.firstChild.nodeName !== 'MAIN' && !FBEditor.editor.Manager.suspendEvent)
			{
				console.log('DOMNodeInserted:', Ext.Object.getValues(FBEditor.editor.Manager.content.nodes)[0].innerHTML);
				if (node.nodeType === Node.TEXT_NODE)
				{
					newEl = FBEditor.editor.Factory.createElementText(node.nodeValue);
				}
				else
				{
					newEl = FBEditor.editor.Factory.createElement(node.localName);
				}
				node.viewportId = viewportId;
				newEl.setNode(node);
				nextSibling = node.nextSibling;
				previousSibling = node.previousSibling;
				parentEl = relNode.getElement();
				console.log('new, parent', node, relNode.outerHTML, parentEl.children.length);
				if (nextSibling)
				{
					nextSiblingEl = nextSibling.getElement();
					console.log('insert, nextSibling', nextSibling);
					parentEl.insertBefore(newEl, nextSiblingEl);
				}
				else if (previousSibling)
				{
					parentEl.add(newEl);
					console.log('add, previousSibling', previousSibling);
				}
				else
				{
					console.log('removeAll');
					parentEl.removeAll();
					parentEl.add(newEl);
				}
				parentEl.sync(viewportId);
				FBEditor.editor.Manager.setFocusElement(newEl);
				e.stopPropagation();
			}
		},

		/**
		 * Удаление узла.
		 * @param {Event} e Объект события.
		 */
		onNodeRemoved: function (e)
		{
			var me = this,
				relNode = e.relatedNode,
				target = e.target,
				viewportId = relNode.viewportId,
				parentEl,
				el;

			// игнориуруется удаление корневого узла, так как он всегда необходим
			if (relNode.firstChild.nodeName !== 'MAIN' && !FBEditor.editor.Manager.suspendEvent)
			{
				console.log('DOMNodeRemoved:', target, relNode.outerHTML);
				parentEl = relNode.getElement();
				el = target.getElement();
				parentEl.remove(el);
				parentEl.sync(viewportId);
				e.stopPropagation();
			}
		},

		/**
		 * Дроп узла.
		 * @param {Event} e Объект события.
		 */
		onDrop: function (e)
		{
			//console.log('drop:', e, me);

			e.preventDefault();
		},

		/**
		 * @protected
		 * Возвращает элемент контроллера.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент контроллера.
		 */
		getElement: function ()
		{
			return this.el;
		},

		/**
		 * @protected
		 * Возвращает выделенный узел html, на котором установлен фокус.
		 * @param {HTMLElement} target Узел html.
		 * @return {HTMLElement}
		 */
		getFocusNode: function (target)
		{
			var me = this,
				sel = window.getSelection(),
				node = target,
				range;

			range = sel && sel.type !== 'None' ? sel.getRangeAt(0) : null;
			if (range)
			{
				if (sel.type === 'Range')
				{
					node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
					       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
				}
				else if (sel.type === 'Caret' && node.nodeName !== 'IMG')
				{
					node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
					       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
				}
			}
			//console.log('sel, range, node', sel, range, node);
			/*if (node.getElement === undefined)
			{
				node = me.getFocusNode(node.parentNode);
			}*/

			return node;
		}
	}
);