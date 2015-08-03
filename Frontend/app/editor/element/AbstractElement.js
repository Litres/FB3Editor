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
			'FBEditor.editor.element.AbstractElementController',
			'FBEditor.editor.command.PasteCommand',
			'FBEditor.editor.command.RemoveNodesCommand'
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
			},
			keyDownEnter: function ()
			{
				this.controller.onKeyDownEnter.apply(this.controller, arguments);
			},
			keyDownDelete: function ()
			{
				this.controller.onKeyDownDelete.apply(this.controller, arguments);
			},
			keyDownBackspace: function ()
			{
				this.controller.onKeyDownBackspace.apply(this.controller, arguments);
			},
			paste: function ()
			{
				this.controller.onPaste.apply(this.controller, arguments);
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
			paste: 'onPaste',
			beforecopy: 'onBeforeCopy',
			copy: 'onCopy'
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
		htmlTag: '',

		/**
		 * @property {String} Имя тега в xml.
		 */
		xmlTag: '',

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
		 * @property {FBEditor.editor.element.marker.MarkerElement} Маркер.
		 */
		marker: null,

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
		 * @property {Object} Аттрибуты элемента по умолчанию.
		 */
		//defaultAttributes: {},

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
			var me = this,
				ch = [];

			children = children || me.children;
			me.elementId = Ext.id({prefix: me.prefixId});
			me.mixins.observable.constructor.call(me, {});

			Ext.Array.each(
				children,
			    function (item, i)
			    {
				    item.parent = me;
				    if (item.isMarker)
				    {
					    me.marker = item;
				    }
				    else
				    {
					    ch.push(item);
				    }
			    }
			);

			me.children = ch;
			me.attributes = Ext.clone(attributes) || me.attributes;
			me.attributes = me.defaultAttributes ? Ext.applyIf(attributes, me.defaultAttributes) : me.attributes;
			me.permit = me.permit ? Ext.applyIf(me.permit, me.permitDefault) : me.permitDefault;
			me.createController();
		},

		add: function (el)
		{
			var me = this;

			if (el.parent)
			{
				// удаляем ссылку на добавляемый элемент из старого родителя
				el.parent.remove(el);
			}

			el.parent = me;

			if (el.isMarker)
			{
				me.marker = el;
			}
			else
			{
				me.children.push(el);
			}
		},

		insertBefore: function (el, nextEl)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(nextEl);

			if (el.parent)
			{
				// удаляем ссылку на вставляемый элемент из старого родителя
				el.parent.remove(el);
			}

			el.parent = me;
			children.splice(pos, 0, el);
			me.children = children;
		},

		replace: function (el, replacementEl)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(replacementEl);

			if (el.parent)
			{
				// удаляем ссылку на заменяющий элемент из старого родителя
				el.parent.remove(el);
			}

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
			if (me.marker)
			{
				node.appendChild(me.marker.getNode(viewportId));
			}
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
			if (me.marker)
			{
				xml += '>' + me.marker.getXml();
			}
			if (children && children.length)
			{
				xml += me.marker ? '' : '>';
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
				xml += me.marker ? '</' + tag + '>' : '/>';
			}

			return xml;
		},

		getData: function ()
		{
			var me = this,
				node,
				data,
				el;

			node = Ext.Object.getValues(me.nodes)[0];

			// текущий выделенный элемент
			el = me.getBlock();

			data = {
				el: el,
				elementName: el.xmlTag,

				// путь html от курсора
				htmlPath: me.getHtmlPath(node)
			};
			Ext.Object.each(
				el.attributes,
				function (key, val)
				{
					data[key] = val ? val : '';
				}
			);

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

			// обновляем дерево навигации по тексту
			FBEditor.editor.Manager.updateTree();
		},

		update: function (data, opts)
		{
			var me = this,
				resData = {},
				markerData = null,
				reg = /^marker-/;

			opts = opts || {};

			//console.log('EL update', me.xmlTag, data, opts);

			if (data.marker && data.marker === 'true')
			{
				markerData = {};
				delete data.marker;
			}
			Ext.Object.each(
				data,
				function (key, val)
				{
					if (!reg.test(key))
					{
						resData[key] = val;
					}
					else if (markerData)
					{
						// данные для маркера собираем отдельно
						markerData[key.replace(reg, '')] = val;
					}
				}
			);

			//console.log('resData, markerData', resData, markerData);

			if (markerData)
			{
				if (me.marker)
				{
					// обновляем маркер
					me.updateMarker(markerData);
				}
				else
				{
					// создаем маркер
					me.createMarker(markerData);
				}
			}
			else
			{
				// удаляем маркер
				me.removeMarker();
			}

			// аттрибуты
			me.attributes = me.defaultAttributes ? Ext.clone(me.defaultAttributes) : {};

			Ext.Object.each(
				resData,
				function (key, val)
				{
					if (val)
					{
						me.attributes[key] = val;
					}
				}
			);

			if (!opts.withoutView)
			{
				me.updateView();
			}
		},

		/**
		 * Обновляет отображение элемента.
		 */
		updateView: function ()
		{
			var me = this,
				manager = FBEditor.editor.Manager,
				viewportId,
				oldNode,
				newNode;

			me.style = '';

			// обновляем узлы элемента
			viewportId = Ext.Object.getKeys(me.nodes)[0];
			oldNode = me.nodes[viewportId];
			manager.suspendEvent = true;
			newNode = me.getNode(viewportId);
			oldNode.parentNode.replaceChild(newNode, oldNode);
			me.sync(viewportId);
			manager.suspendEvent = false;
		},

		/**
		 * Устанавливает события узла элемента.
		 * @param {Node} element Узел элемента.
		 * @return {Node} element Узел элемента.
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
		 * Возвращает имя элемента.
		 * @return {String} Имя элемента.
		 */
		getName: function ()
		{
			return this.xmlTag;
		},

		/**
		 * Возвращает блочный элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getBlock: function ()
		{
			var el = this;

			while (el.isStyleType || el.isText)
			{
				el = el.parent;
			}

			return el;
		},

		/**
		 * Рекурсивно возвращает путь html элемента от текущего до корневого элемента.
		 * @param {Node} node Узел текущего элемента.
		 * @param {String} [path] Данный параметр не указывается, он необходим для рекурсии.
		 * @return {String} Путь html.
		 */
		getHtmlPath: function (node, path)
		{
			var me = this,
				name,
				parentNode,
				newPath;

			parentNode = node && node.parentNode ? node.parentNode : null;
			name = node && node.nodeType !== Node.TEXT_NODE ? node.nodeName : '';
			newPath = name + (path ? ' > ' + path : '');
			//console.log(node, name, parentNode.parentNode, path, newPath);
			if (name !== 'MAIN' && parentNode)
			{
				newPath = me.getHtmlPath(parentNode, newPath);
			}

			return newPath;
		},

		/**
		 * Возвращает количество дочерних элементов с определенным значением свойства.
		 * @param {String} nameProp Имя свойства элемента.
		 * @param {*} valueProp Значение свойства элемента.
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
				node,
				text;

			node = Ext.Object.getValues(me.nodes)[0];
			text = node.textContent || node.innerText;

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
		 * Удаляет отображение элемента из html.
		 */
		removeView: function ()
		{
			var me = this;

			Ext.Object.each(
				me.nodes,
			    function (id, node)
			    {
				    var parent = node.parentNode;

				    if (parent)
				    {
					    parent.removeChild(node);
				    }
			    }
			);
			me.nodes = {};
		},

		/**
		 * Проверяет имя элемента.
		 * @param {String} name Проверочное имя для элемента.
		 * @return {Boolean} Соответствует ли переданное имя элементу.
		 */
		hisName: function (name)
		{
			var me = this,
				res;

			res = me.xmlTag === name;

			return res;
		},

		/**
		 * Имеет ли элемент родителя с именем name. Поиск происходит по всем родителям, вплоть до корня.
		 * @param {String} name Имя родительского элемента.
		 * @returns {Boolean}
		 */
		hasParentName: function (name)
		{
			var me = this,
				el = me.parent;

			while (el)
			{
				if (el.hisName(name))
				{
					return true;
				}

				el = el.parent;
			}

			return false;
		},

		/**
		 * Пустой ли элемент.
		 * @return {Boolean}
		 */
		isEmpty: function ()
		{
			var me = this;

			if (!me.children.length)
			{
				return true;
			}

			//me.removeEmptyText();

			if (me.children.length === 1)
			{
				return me.children[0].isEmpty();
			}
			else
			{
				return false;
			}
		},

		/**
		 * Удаляет все пустые текстовые узлы в элементе.
		 */
		removeEmptyText: function ()
		{
			var me = this,
				children = me.children,
				pos = 0,
				child;

			while (pos < children.length)
			{
				child = children[pos];
				if (child.isText && child.isEmpty())
				{
					//console.log('remove view', child);
					me.remove(child);
					child.removeView();
				}
				else
				{
					child.removeEmptyText();
					pos++;
				}
			}
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
		},

		/**
		 * @protected
		 * Создает маркер.
		 * @param {Object} data Данные маркера.
		 */
		createMarker: function (data)
		{
			var me = this,
				marker,
				img,
				factory = FBEditor.editor.Factory;

			img = factory.createElement('img', data);
			marker = factory.createElement('marker', {}, img);
			me.add(marker);
		},

		/**
		 * @protected
		 * Обновляет маркер.
		 * @param {Object} data Данные маркера.
		 */
		updateMarker: function (data)
		{
			var me = this;

			me.marker.img.update(data, {'withoutView': true});
		},

		/**
		 * @protected
		 * Удаляет маркер.
		 */
		removeMarker: function ()
		{
			this.marker = null;
		},

		/**
		 * Возвращает модель элемента, в которую включены только стилевые элементы и текст.
		 * @param {FBEditor.editor.element.AbstractElement} fragment Пустой элемент, в который будут помещаться
		 * необходимые результирующие элементы.
		 */
		getOnlyStylesChildren: function (fragment)
		{
			var me = this,
				pos = 0,
				child;

			//console.log('* me', me.xmlTag, me.children);

			while (pos < me.children.length)
			{
				child = me.children[pos];

				if (!child.isStyleType && !child.isText)
				{
					//console.log('style child', pos, child ? child.xmlTag : '');

					// ищем стилевого потомка
					child.getOnlyStylesChildren(fragment);
				}

				if (child && (child.isStyleType || child.isText))
				{
					//console.log('child', pos, child.xmlTag);

					// добавляем в контейнер стилевой элемент
					fragment.add(child);
				}
				else
				{
					// позиция следующего потомка
					pos++;
				}
			}
		},

		beforeCopy: function ()
		{
			var me = this;

			Ext.Array.each(
				me.children,
			    function (el)
			    {
				    el.beforeCopy();
			    }
			);
		},

		afterCopy: function ()
		{
			var me = this;

			Ext.Array.each(
				me.children,
				function (el)
				{
					el.afterCopy();
				}
			);
		}
	}
);