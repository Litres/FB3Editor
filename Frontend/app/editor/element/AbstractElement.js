/**
 * Класс абстрактого элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElement',
	{
		extend: 'FBEditor.editor.element.InterfaceElement',
		requires: [
			'FBEditor.editor.element.AbstractElementController'
		],
		mixins: {
			observable: 'Ext.util.Observable'
		},
		listeners: {
			splitElement: function ()
			{
				this.controller.onSplitElement.apply(this.controller, arguments);
			},
			createElement: function ()
			{
				this.controller.onCreateElement.apply(this.controller, arguments);
			},
			insertElement: function ()
			{
				this.controller.onInsertElement.apply(this.controller, arguments);
			}
		},

		/**
		 * @property {String} Класс контроллера элемента.
		 */
		controllerClass: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * @property {Object} Обработчики событий контроллера.
		 */
		customListeners: {
			keydown: 'onKeyDown',
			keyup: 'onKeyUp',
			mouseup: 'onMouseUp',
			DOMNodeInserted: 'onNodeInserted',
			DOMNodeRemoved: 'onNodeRemoved',
			DOMCharacterDataModified: 'onTextModified',
			drop: 'onDrop',
			paste: 'onPaste'
		},

		/**
		 * @property {Object} Разрешения элемента. Перечисляются в самих элементах.
		 */
		//permit: {},

		/**
		 * @property {Object} Разрешения элемента по умолчанию.
		 */
		permitDefault:
		{
			splittable: false // разрешается ли разбивать элемент клавишами Ctrl/Shift+Enter
		},

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

		/**
		 * @property {String} Базовый css класс элемента.
		 */
		baseCls: '',

		/**
		 * @property {String} Сss класс элемента.
		 */
		cls: '',

		/**
		 * @property {FBEditor.editor.element.AbstractElement[]} Дочерние элементы.
		 */
		children: [],

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Родительский элемент.
		 */
		parent: null,

		/**
		 * @property {Object} attributes Атрибуты элемента.
		 */
		attributes: {},

		/**
		 * @property {String} Уникальный id элемента.
		 */
		elementId: '',

		/**
		 * @property {String} Префикс id элемента.
		 */
		prefixId: 'editor-el',

		/**
		 * @property {Boolean} Отображать ли в дереве навигации.
		 */
		showedOnTree: true,

		/**
		 * @property {String} Полный путь элемента в дереве навигации.
		 */
		treePath: '',

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElementController} Контроллер элемента.
		 */
		//controller: null,

		/**
		 * @private
		 * @property {Object} Узлы html, привязанные к своим окнам.
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

			me.elementId = Ext.id({prefix: me.prefixId});
			me.mixins.observable.constructor.call(me, {});
			me.children = children || me.children;
			Ext.Array.each(
				me.children,
			    function (item)
			    {
				    item.parent = me;
			    }
			);
			me.attributes = attributes || me.attributes;
			me.permit = me.permit ? Ext.applyIf(me.permit, me.permitDefault) : me.permitDefault;
			me.createController();
		},

		add: function (el)
		{
			var me = this;

			el.parent = me;
			me.children.push(el);
		},

		insertBefore: function (el, nextEl)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(nextEl);

			el.parent = me;
			children.splice(pos, 0, el);
			me.children = children;
		},

		replace: function (el, replacementEl)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(replacementEl);

			el.parent = me;
			me.remove(replacementEl);
			children.splice(pos, 1, el);
			me.children = children;
		},

		remove: function (el, opts)
		{
			var me = this,
				children = me.children,
				pos,
				ignoredClear;

			if (el)
			{
				pos = me.getChildPosition(el);
				if (pos !== null)
				{
					if (!ignoredClear)
					{
						el.clear();
					}
					//el.removeAll();
					children.splice(pos, 1);
					me.children = children;
				}
			}
		},

		removeAll: function ()
		{
			var me = this,
				children = me.children;

			 Ext.Array.each(
				 children,
			     function (el)
			     {
				     me.remove(el);
			     }
			 );
		},

		clear: function ()
		{
			var me = this,
				children = me.children;

			Ext.Array.each(
				children,
				function (el)
				{
					el.clear(el);
				}
			);
		},

		clone: function (opts)
		{
			var me = this,
				children = me.children,
				newEl,
				ignoredText,
				ignoredDeep;

			ignoredText = opts && opts.ignoredText ? true : false;
			ignoredDeep = opts && opts.ignoredDeep ? true : false;
			if (me.isText && ignoredText)
			{
				return null;
			}
			newEl = me.isText ? FBEditor.editor.Factory.createElementText(me.text) :
			        FBEditor.editor.Factory.createElement(me.xmlTag);
			if (!ignoredDeep)
			{
				Ext.Array.each(
					children,
					function (el)
					{
						var cloneEl = el.clone(opts);

						if (cloneEl)
						{
							newEl.add(cloneEl);
						}
					}
				);
			}

			return newEl;
		},

		setNode: function (node)
		{
			var me = this;

			me.setStyleHtml();
			node = me.setAttributesHtml(node);
			node = me.setEvents(node);
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
			node.viewportId = viewportId;
			me.setNode(node);
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

		getData: function ()
		{
			var me = this,
				node,
				htmlPath,
				data;

			function getHtmlPath (node, path)
			{
				var name = node.nodeType !== Node.TEXT_NODE ? node.nodeName : '',
					parentNode = node.parentNode,
					newPath;

				newPath = name + (path ? ' > ' + path : '');
				if (name !== 'MAIN')
				{
					newPath = getHtmlPath(parentNode, newPath);
				}

				return newPath;
			}

			node = Ext.Object.getValues(me.nodes)[0];
			htmlPath = getHtmlPath(node);
			data = {
				xmlName: me.xmlTag,
				htmlPath: htmlPath
			};

			return data;
		},

		sync: function (viewportId)
		{
			var me = this,
				newNode;

			FBEditor.editor.Manager.suspendEvent = true;
			//console.log('sync ' + viewportId, me.nodes);
			Ext.Object.each(
				me.nodes,
			    function (id, oldNode)
			    {
				    if (id !== viewportId)
				    {
					    newNode = me.getNode(id);
					    //console.log('newNode, oldNode', newNode, oldNode, oldNode.parentNode);
					    oldNode.parentNode.replaceChild(newNode, oldNode);
				    }
			    }
			);
			FBEditor.editor.Manager.suspendEvent = false;

			if (!me.isText)
			{
				// обновляем дерево навигации по тексту
				FBEditor.editor.Manager.updateTree();
			}
		},

		/**
		 * Устанавливает события узла элемента.
		 * @param {HTMLElement} element Узел элемента.
		 * @return {HTMLElement} element Узел элемента.
		 */
		setEvents: function (element)
		{
			var me = this,
				listeners = me.customListeners;

			Ext.Object.each(
				listeners,
			    function (eventName, funcName)
			    {
				    if (me.controller[funcName])
				    {
					    element.addEventListener(
						    eventName,
						    function (e)
						    {
							    me.controller[funcName](e);
						    },
						    false
					    );
				    }
			    }
			);

			return element;
		},

		/**
		 * Возвращает количество дочерних элементов с определенным значением свойства.
		 * @param {String} nameProp Имя свойства элемента.
		 * @param {String} valueProp Значение свойства элемента.
		 * @return {Number}
		 */
		getChildrenCountByProp: function (nameProp, valueProp)
		{
			var me = this,
				count = 0;

			Ext.Array.each(
				me.children,
			    function (item)
			    {
				    if (item[nameProp] === valueProp)
				    {
					    count++;
				    }
			    }
			);

			return count;
		},

		/**
		 * Возвращает позицию дочернего элемента, относительно родителя.
		 * @param {FBEditor.editor.element.AbstractElement} el Дочерний элемент.
		 * @return {Number} Позиция дочернего элемента.
		 */
		getChildPosition: function (el)
		{
			var me = this,
				children = me.children,
				pos = null;

			if (!el.elementId)
			{
				console.error(el);

				return null;
			}
			Ext.Array.each(
				children,
				function (item, index)
				{
					if (el.elementId ===  item.elementId)
					{
						pos = index;

						return false;
					}
				}
			);

			return pos;
		},

		/**
		 * Создает внутреннее содержимое элемента.
		 * @return {Object} Элементы.
		 */
		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.node = me;

			return els;
		},

		/**
		 * Возвращает текстовое содержимое элемента.
		 * @return {String} Текст.
		 */
		getText: function ()
		{
			var me = this,
				text;

			text = Ext.Object.getValues(me.nodes)[0].innerText;

			return text;
		},

		/**
		 * Возвращает название элемента для отображения в узле дерева навигации по тексту.
		 * @return {String} Название.
		 */
		getNameTree: function ()
		{
			var me = this,
				name;

			name = '&lt;' + me.xmlTag + '&gt;';

			if (me.children.length && me.children[0].xmlTag === 'title')
			{
				name += ' ' + me.children[0].getText();
			}

			return name;
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
				el = element,
				cls;

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
				cls = me.baseCls ? me.baseCls : '';
				cls += cls ? ' ' + me.cls : me.cls;
				el.setAttribute('class', cls);
			}

			return el;
		},

		/**
		 * @protected
		 * Создает контроллер элемента.
		 * @param {FBEditor.editor.element.AbstractElement} scope Элемент, к которому привязан контроллер.
		 */
		createController: function (scope)
		{
			var me = this;

			me.controller = Ext.create(me.controllerClass, scope || me);
		}
	}
);