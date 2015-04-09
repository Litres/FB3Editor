/**
 * Класс абстрактого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElement',
	{
		extend: 'FBEditor.editor.element.InterfaceElement',

		/**
		 * @property {FBEditor.editor.element.AbstractElement[]} [children] Дочерние элементы.
		 */
		children: [],

		/**
		 * @property {Object} attributes Атрибуты элемента.
		 */
		attributes: {},

		/**
		 * @property {String} Имя тега для отображения в html.
		 */
		htmlTag: 'div',

		/**
		 * @property {String} Имя тега в xml.
		 */
		xmlTag: 'div',

		/**
		 * @property {String} Строка стилей.
		 */
		style: '',

		baseCls: '',

		cls: '',

		/**
		 * @private
		 * @config {Object} Узлы html, привязанные к своим окнам.
		 * Ключ каждого свойства представляет id окна, а значение - узел html.
		 */
		//nodes: {},

		/**
		 * @param {Object} attributes Атрибуты элемента.
		 * @param {FBEditor.editor.element.AbstractElement[]|null} [children] Дочерние элементы.
		 */
		constructor: function (attributes, children)
		{
			var me = this;

			me.initConfig();
			me.children = children || me.children;
			me.attributes = attributes || me.attributes;
		},

		add: function (el)
		{
			var me = this;

			me.children.push(el);
		},

		insertBefore: function (el, nextEl)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(nextEl);

			children.splice(pos, 0, el);
			me.children = children;
		},

		remove: function (el)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(el);

			children.splice(pos, 1);
			me.children = children;
		},

		removeAll: function ()
		{
			var me = this;

			me.children = [];
		},

		setNode: function (node)
		{
			var me = this;

			node.getElement = function ()
			{
				return me;
			};
			me.nodes = me.nodes || {};
			me.nodes[node.viewportId] = node;
		},

		getNode: function (viewportId)
		{
			var me = this,
				children = me.children,
				tag = me.htmlTag,
				node;

			node = document.createElement(tag);
			me.setStyleHtml();
			node = me.setAttributesHtml(node);
			node.viewportId = viewportId;
			me.setNode(node);
			node = me.setEvents(node);
			if (children && children.length)
			{
				Ext.Array.each(
					children,
					function (item)
					{
						node.appendChild(item.getNode(viewportId));
					}
				);
			}

			return node;
		},

		removeNodes: function (viewportId)
		{
			var me = this,
				children = me.children;

			delete me.nodes[viewportId];
			if (children.length)
			{
				Ext.Array.each(
					children,
					function (item)
					{
						item.removeNodes(viewportId);
					}
				);
			}
		},

		getXml: function ()
		{
			var me = this,
				children = me.children,
				tag = me.xmlTag,
				xml,
				attr;

			attr = me.getAttributesXml();
			xml = '<' + tag;
			xml += attr ? ' ' + attr : '';
			if (children && children.length)
			{
				xml += '>';
				Ext.Array.each(
					children,
					function (item)
					{
						xml += item.getXml();
					}
				);
				xml += '</' + tag + '>';
			}
			else
			{
				xml += '/>';
			}

			return xml;
		},

		sync: function (viewportId)
		{
			var me = this,
				newNode;

			FBEditor.editor.Manager.suspendEvent = true;
			console.log('sync start ' + viewportId, me.nodes);
			Ext.Object.each(
				me.nodes,
			    function (id, oldNode)
			    {
				    if (id !== viewportId)
				    {
					    newNode = me.getNode(id);
					    console.log('newNode, oldNode', newNode, oldNode, oldNode.parentNode);
					    oldNode.parentNode.replaceChild(newNode, oldNode);
				    }
			    }
			);
			console.log('sync end');
			FBEditor.editor.Manager.suspendEvent = false;
		},

		setEvents: function (element)
		{
			var me = this;

			// отпускание кнопки мыши определяет элемент, на котором находится фокус
			element.addEventListener(
				'mouseup',
				function (e)
				{
					var focusNode,
						focusElement;

					focusNode = me.getFocusNode(e);
					focusElement = focusNode.getElement();
					console.log('mouseup: focusNode, focusElement', e, focusNode, focusElement);
					FBEditor.editor.Manager.setFocusElement(focusElement);
					e.stopPropagation();

					return false;
				},
				false
			);

			// вставка нового узла
			element.addEventListener(
				'DOMNodeInserted',
				function (e)
				{
					var relNode = e.relatedNode,
						node = e.target,
						viewportId = relNode.viewportId,
						newEl,
						nextSibling,
						previousSibling,
						parentEl,
						nextSiblingEl;

					// игнориуруется вставка корневого узла, так как он уже вставлен и
					// игнорируется вставка при включенной заморозке
					if (relNode.firstChild.localName !== 'main' && !FBEditor.editor.Manager.suspendEvent)
					{
						console.log('DOMNodeInserted:', e);
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
						//console.log('newEl', newEl, nextSibling);
						if (nextSibling)
						{
							nextSiblingEl = nextSibling.getElement();
							parentEl.insertBefore(newEl, nextSiblingEl);
							parentEl.sync(viewportId);
							FBEditor.editor.Manager.setFocusElement(newEl);
						}
						else if (!nextSibling && !previousSibling)
						{
							parentEl.removeAll();
							parentEl.add(newEl);
							parentEl.sync(viewportId);
							FBEditor.editor.Manager.setFocusElement(newEl);
						}
						else
						{
							parentEl.add(newEl);
							parentEl.sync(viewportId);
							FBEditor.editor.Manager.setFocusElement(newEl);
						}
					}
				},
				false
			);

			// удаление узла
			element.addEventListener(
				'DOMNodeRemoved',
				function (e)
				{
					var relNode = e.relatedNode,
						target = e.target,
						viewportId = relNode.viewportId,
						parentEl,
						el;

					// игнориуруется удаление корневого узла, так как он всегда необходим
					if (relNode.firstChild.localName !== 'main' && !FBEditor.editor.Manager.suspendEvent)
					{
						console.log('DOMNodeRemoved:', e, me);
						parentEl = relNode.getElement();
						el = target.getElement();
						parentEl.remove(el);
						parentEl.sync(viewportId);
					}
				},
				false
			);

			// дроп узла
			element.addEventListener(
				'drop',
				function (e)
				{
					//console.log('drop:', e, me);

					e.preventDefault();
				},
				false
			);

			return element;
		},

		/**
		 * @protected
		 * Возвращает строку атрибутов элементов для xml.
		 * @return {String} Строка атрибутов.
		 */
		getAttributesXml: function ()
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					attr += key + '="' + val + '" ';
				}
			);

			return attr;
		},

		/**
		 * @protected
		 * Устанавливает стили для узла html.
		 * @return {String} Строка стилей.
		 */
		setStyleHtml: function ()
		{
			return this.style;
		},

		/**
		 * @protected
		 * Устанавливает атрибуты html-элемента.
		 * @param {HTMLElement} element
		 * @return {HTMLElement} element
		 */
		setAttributesHtml: function (element)
		{
			var me = this,
				el = element;

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					el.setAttribute(key, val);
				}
			);
			if (me.style)
			{
				el.setAttribute('style', me.style);
			}
			if (me.baseCls || me.cls)
			{
				el.setAttribute('class', me.baseCls + ' ' + me.cls);
			}

			return el;
		},

		/**
		 * @protected
		 * Возвращает позицию дочернего элемента, относительно родителя.
		 * @param {FBEditor.editor.element.AbstractElement} el Дочерний элемент.
		 * @return {Number} Позиция дочернего элемента.
		 */
		getChildPosition: function (el)
		{
			var me = this,
				children = me.children,
				pos = 0;

			Ext.Array.each(
				children,
				function (item, index)
				{
					if (Ext.Object.equals(el, item))
					{
						pos = index;

						return false;
					}
				}
			);

			return pos;
		},

		/**
		 * @protected
		 * Возвращает выделенный узел html, на котором установлен фокус.
		 * @param {MouseEvent} e Событие отпускания кнопки мыши.
		 * @return {HTMLElement}
		 */
		getFocusNode: function (e)
		{
			var sel = window.getSelection(),
				range = sel.getRangeAt(0) || null,
				target = e.target,
				node = target;

			if (range && sel.type === 'Range')
			{
				node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
				       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
			}

			return node;
		}
	}
);