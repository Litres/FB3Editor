/**
 * Класс абстрактого элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElement',
	{
		requires: [
			'FBEditor.editor.command.PasteCommand',
			'FBEditor.editor.command.RemoveNodesCommand',
			'FBEditor.editor.element.AbstractElementController',
			'FBEditor.editor.element.AbstractSelection',
			'FBEditor.editor.helper.element.Node'
		],
		mixins: {
			observable: 'Ext.util.Observable'
		},

		/**
		 * @property {String} Класс контроллера элемента.
		 */
		controllerClass: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * @property {String} Класс контроллера элемента при использовании WebKit.
		 */
		controllerClassWebkit: '',

		/**
		 * @property {String} Класс для обработки выделения.
		 * Если не указан, то не используется.
		 *
		 * @example
		 * Смотрите пример реализации FBEditor.editor.element.table.TableSelection
		 */
		selectionClass: '',

		/**
		 * @property {Object} Нативные обработчики событий браузера.
		 */
		customListeners: {
			keydown: 'onKeyDown',
			keyup: 'onKeyUp',
			keypress: 'onKeyPress',
			mouseup: 'onMouseUp',
			mousedown: 'onMouseDown',
			mousemove: 'onMouseMove',
			DOMNodeInserted: 'onNodeInserted',
			DOMNodeRemoved: 'onNodeRemoved',
			DOMCharacterDataModified: 'onTextModified',
			drop: 'onDrop',
			paste: 'onPaste',
			beforecopy: 'onBeforeCopy',
			copy: 'onCopy',
			scroll: 'onScroll',
			focus: 'onFocus'
		},

		/**
		 * @property {Boolean} Разрешается ли разбивать элемент клавишами Ctrl/Shift+Enter.
		 */
		splittable: false,

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
		 * @property {FBEditor.editor.selection.Selection} Выделение элемента.
		 */
		//selection: null,

		/**
		 * @private
		 * @property {FBEditor.editor.helper.element.Node} Хэлпер для работы с отображением элемента.
		 */
		//nodeHelper: null,

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

			// создаем контроллер
			me.createController();
		},

		/**
		 * Эквивалентны ли элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Сравниваемый элемент.
		 * @return {Boolean}
		 */
		equal: function (el)
		{
			var me = this,
				equal;

			equal = el.elementId === me.elementId;

			return equal;
		},

		/**
		 * Добавляет новый дочерний элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
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

		/**
		 * Вставляет новый дочерний элемент перед другим дочерним элементом.
		 * @param {FBEditor.editor.element.AbstractElement} el Вставляемый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} nextEl Элемент, перед которым происходит вставка.
		 */
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

		/**
		 * Заменяет дочерний элемент на новый.
		 * @param {FBEditor.editor.element.AbstractElement} el Новый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} replacementEl Заменяемый элемент.
		 */
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

		/**
		 * Удаляет дочерний элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		remove: function (el)
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

		/**
		 * Возвращает первый элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Первый элемент.
		 */
		first: function ()
		{
			var me = this,
				children = me.children,
				first;

			first = children.length ? children[0] : null;

			return first;
		},

		/**
		 * Возвращает последний элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Первый элемент.
		 */
		last: function ()
		{
			var me = this,
				children = me.children,
				last;

			last = children.length ? children[children.length - 1] : null;

			return last;
		},

		/**
		 * Возвращает предыдущий элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Предыдущий элемент.
		 */
		prev: function ()
		{
			var me = this,
				parent = me.parent,
				pos,
				prev;

			if (!parent)
			{
				return null;
			}

			pos = parent.getChildPosition(me);
			prev = (pos - 1) >= 0 && parent.children[pos - 1] ? parent.children[pos - 1] : null;

			return prev;
		},

		/**
		 * Возвращает следующий элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Следующий элемент.
		 */
		next: function ()
		{
			var me = this,
				parent = me.parent,
				pos,
				next;

			if (!parent)
			{
				return null;
			}

			pos = parent.getChildPosition(me);
			next = parent.children[pos + 1] ? parent.children[pos + 1] : null;

			return next;
		},

		/**
		 * Удаляет все дочерние элементы.
		 */
		removeAll: function ()
		{
			var me = this,
				children = me.children,
				el;

			while (children.length)
			{
				el = children[0];
				me.remove(el);
			}
		},

		/**
		 * Перебирает всех потомков, передавая их в функцию.
		 * @param {Function} fn Функция-итератор.
		 */
		each: function (fn)
		{
			Ext.Array.each(this.children, fn);
		},

		/**
		 * Удаляет все связи элемента на используемые объекты.
		 */
		clear: function ()
		{
			//
		},

		/**
		 * Клонирует элемент.
		 * @param {Object} opts Опции клонирования..
		 * @return {FBEditor.editor.element.AbstractElement} Клонированный элемент.
		 */
		clone: function (opts)
		{
			var me = this,
				children = me.children,
				factory = FBEditor.editor.Factory,
				newEl,
				ignoredText,
				ignoredDeep;

			ignoredText = opts && opts.ignoredText ? true : false;
			ignoredDeep = opts && opts.ignoredDeep ? true : false;

			if (me.isText && ignoredText)
			{
				return null;
			}

			newEl = me.isText ? factory.createElementText(me.text) :
			        factory.createElement(me.getName());

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

		/**
		 * Устанавливает узел для элемента.
		 * @param {Node} node Узел html.
		 */
		setNode: function (node)
		{
			var me = this;

			// инициализируем стиль элемента
			me.setStyleHtml();

			// аттрибуты узла
			node = me.setAttributesHtml(node);

			// события узла
			node = me.setEvents(node);

			// дабавляем в узел обратную свзять с моделью элемента
			node.getElement = function ()
			{
				return me;
			};

			// обработка выделения
			me.createSelection(node);

			// инициализируем список узлов из разных окон
			me.nodes = me.nodes || {};

			// сохраняем узел в списке для конкретного окна
			me.nodes[node.viewportId] = node;

			if (me.isHide)
			{
				// скрываем узел, если необходимо по умолчанию
				me.hide();
			}
		},

		/**
		 * Создает и возвращает узел для отображения элемента.
		 * @param {String} viewportId Id окна.
		 * @return {Node} Узел html.
		 */
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

		/**
		 * Удаляет все ссылки на узлы окна.
		 * @param {String} viewportId Id окна.
		 */
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

		/**
		 * Устанавливает или сбрасывает выделение узла в окне.
		 * @param {Boolean} selected Установить ли выделение.
		 * @param {String} viewportId Id окна.
		 */
		selectNode: function (selected, viewportId)
		{
			var me = this,
				node = me.nodes[viewportId],
				cls = me.cls,
				manager = me.getManager(),
				selectCls = manager.selectCls,
				reg;

			reg = new RegExp(selectCls);

			if (!reg.test(cls) && selected)
			{
				// выделяем узел
				cls = cls + ' ' + selectCls;
				node.setAttribute('class', cls);
			}

			if (reg.test(cls) && !selected)
			{
				// убираем выделение
				cls = cls.replace(' ' + selectCls, '');
				node.setAttribute('class', cls);
			}

			me.cls = cls;
		},

		/**
		 * Возвращает элемент в виде строки xml.
		 * @param {Boolean} [withoutText] Надо ли исключить текст из xml.
		 * @return {String}
		 */
		getXml: function (withoutText)
		{
			var me = this,
				children = me.children,
				tag = me.xmlTag,
				xml,
				attr;

			attr = me.getAttributesXml(withoutText);
			xml = '<' + tag;
			xml += attr ? ' ' + attr : '';

			if (me.marker)
			{
				xml += '>' + me.marker.getXml(withoutText);
			}

			if (children && children.length)
			{
				xml += me.marker ? '' : '>';
				Ext.Array.each(
					children,
					function (item)
					{
						xml += item.getXml(withoutText);
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

		/**
		 * Возвращает данные об элементе.
		 * @return {Object} Данные элемента.
		 */
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

		/**
		 * Синхронизирует узлы элемента в окнах.
		 * @param {String} viewportId Id окна источника.
		 */
		sync: function (viewportId)
		{
			var me = this,
				manager = me.getManager(),
				newNode;

			manager.setSuspendEvent(true);

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

			manager.setSuspendEvent(false);
		},

		/**
		 * Обновляет данные элемента и его отображение.
		 * @param {Object} data Новые данные для элемента.
		 * @param {Object} [opts] Опции.
		 * @param {Boolean} opts.withoutView true - обновить только данные, без обновления отображения.
		 */
		update: function (data, opts)
		{
			var me = this,
				resData = {},
				markerData = null,
				reg = /^marker-/;

			opts = opts || {};

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
				manager = me.getManager(),
				viewportId,
				oldNode,
				newNode;

			me.style = '';

			// обновляем узлы элемента
			viewportId = Ext.Object.getKeys(me.nodes)[0];
			oldNode = me.nodes[viewportId];
			manager.setSuspendEvent(true);
			newNode = me.getNode(viewportId);
			oldNode.parentNode.replaceChild(newNode, oldNode);
			me.sync(viewportId);
			manager.setSuspendEvent(false);
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
		 * Возвращает корневой элемент.
		 * @return {FBEditor.editor.element.root.RootElement}
		 */
		getRoot: function ()
		{
			var el = this,
				parent = el.isRoot ? el : el.parent;

			while (parent && !parent.isRoot)
			{
				parent = parent.parent;
			}

			return parent;
		},

		/**
		 * Возвращает родительский блочный элемент.
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
					if (el.elementId === item.elementId)
					{
						pos = index;

						return false;
					}
				}
			);

			return pos;
		},

		/**
		 * Возвращает объект выделения.
		 * @return {FBEditor.editor.element.AbstractSelection}
		 */
		getSelection: function ()
		{
			return this.selection;
		},

		/**
		 * Возвращает редактор текста, которому принадлежит элемент.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			var me = this,
				root,
				editor;

			root = me.getRoot();
			editor = root ? root.getEditor() : null;

			return editor;
		},

		/**
		 * Возвращает историю редактора текста.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function ()
		{
			var me = this,
				editor = me.getEditor(),
				history;

			history = editor.getHistory();

			return history;
		},

		/**
		 * Возвращает менеджер редактора текста.
		 * @return {FBEditor.editor.Manager}
		 */
		getManager: function ()
		{
			var me = this,
				editor,
				manager;

			editor = me.getEditor ? me.getEditor() : null;
			manager = editor ? editor.getManager() : null;

			return manager;
		},

		/**
		 * Возвращает хэлпер для работы с отображением элемента.
		 * @return {FBEditor.editor.helper.element.Node}
		 */
		getNodeHelper: function ()
		{
			return this.nodeHelper || this.createNodeHelper();
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
			text = node ? node.textContent || node.innerText : '';

			return text || '';
		},

		/**
		 * Возвращает название элемента для отображения в узле дерева навигации по тексту.
		 * @return {String} Название.
		 */
		getNameTree: function ()
		{
			var me = this,
				name = '';

			if (me.children.length && me.children[0].xmlTag === 'title')
			{
				name += me.children[0].getText() + ' ';
			}

			name += '&lt;' + me.xmlTag + '&gt;';

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
		 * @return {Boolean}
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
		 * Возвращает элемент родителя с именем name. Поиск происходит по всем родителям, вплоть до корня.
		 * @param {String} name Имя родительского элемента.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getParentName: function (name)
		{
			var me = this,
				el = me.parent;

			while (el)
			{
				if (el.hisName(name))
				{
					return el;
				}

				el = el.parent;
			}

			return null;
		},

		/**
		 * Возвращает родительский элемент типа абзаца.
		 * @return {FBEditor.editor.element.AbstractStyleHolderElement}
		 */
		getStyleHolder: function ()
		{
			var me = this,
				parent = me;

			while (parent && !parent.isStyleHolder)
			{
				parent = parent.parent ? parent.parent : null;
			}

			return parent;
		},

		/**
		 * Возвращает самый вложенный первый дочерний элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getDeepFirst: function ()
		{
			var me = this,
				el = me;

			while (el.first())
			{
				el = el.first();
			}

			return el;
		},

		/**
		 * Возвращает самый вложенный последний дочерний элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getDeepLast: function ()
		{
			var me = this,
				el = me;

			while (el.last())
			{
				el = el.last();
			}

			return el;
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
		 * @param {Boolean} [removeEmptyStyleHolder] Удалять ли абзацы без дочерних элементов.
		 */
		removeEmptyText: function (removeEmptyStyleHolder)
		{
			var me = this,
				children = me.children,
				pos = 0,
				child;

			while (pos < children.length)
			{
				child = children[pos];

				if (child.isText && child.isEmpty() ||
				    removeEmptyStyleHolder && child.isStyleHolder && !child.children.length)
				{
					//console.log('remove view', child);
					me.remove(child);
					child.removeView();
				}
				else
				{
					child.removeEmptyText(removeEmptyStyleHolder);
					pos++;
				}
			}
		},

		/**
		 * Сбрасывает карту координат символов.
		 */
		clearMapCoords: function ()
		{
			var me = this;
			
			me.each(
				function (child)
				{
					child.clearMapCoords();
				}
			);
		},

		/**
		 * Скрывает узел элемента.
		 */
		hide: function ()
		{
			var me = this,
				nodes = me.nodes;

			me.isHide = true;

			Ext.Object.each(
				nodes,
				function (key, node)
				{
					// сохраняем свойство видимости узла
					me.styleDisplay = node.style.display;

					node.style.display = 'none';
				}
			);
		},

		/**
		 * Показывает узел элемента.
		 */
		show: function ()
		{
			var me = this,
				nodes = me.nodes;

			me.isHide = false;

			Ext.Object.each(
				nodes,
				function (key, node)
				{
					node.style.display = me.styleDisplay;
				}
			);
		},

		/**
		 * @protected
		 * Возвращает строку атрибутов элементов для xml.
		 * @param {Boolean} [withoutText] Надо ли исключить текст из xml.
		 * @return {String} Строка атрибутов.
		 */
		getAttributesXml: function (withoutText)
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

			me.initCls();

			if (me.cls)
			{
				el.setAttribute('class', me.cls);
			}

			return el;
		},

		/**
		 * @protected
		 * Создает класс для обработки выделения элемента.
		 * @param {Node} node Узел элемента.
		 */
		createSelection: function (node)
		{
			var me = this,
				selectionClass = me.selectionClass;

			if (selectionClass)
			{
				try
				{
					selectionClass = Ext.isWebKit ? selectionClass + 'WebKit' : selectionClass;
					me.selection = Ext.create(selectionClass, node);
				}
				catch (e)
				{
					me.selection = Ext.create(me.selectionClass, node);

					Ext.log(
						{
							msg: 'Необходимо создать класс ' + selectionClass,
							level: 'error'
						}
					);
				}
			}
		},

		/**
		 * @protected
		 * Создает контроллер элемента.
		 * @param {FBEditor.editor.element.AbstractElement} scope Элемент, к которому привязан контроллер.
		 * @return {FBEditor.editor.element.AbstractElementController} Контроллер элемента.
		 */
		createController: function (scope)
		{
			var me = this,
				controllerClass = me.controllerClass,
				controllerClassWebkit = me.controllerClassWebkit,
				controller;

			if (controllerClass)
			{
				try
				{
					controllerClass = Ext.isWebKit && controllerClassWebkit ? controllerClassWebkit : controllerClass;
					controller = Ext.create(controllerClass, scope || this);
				}
				catch (e)
				{
					controller = Ext.create(me.controllerClass, scope || this);

					Ext.log(
						{
							msg: 'Необходимо создать класс ' + controllerClass,
							level: 'error'
						}
					);
				}
			}

			me.controller = controller;

			return controller;
		},

		/**
		 * @protected
		 * Инициализирует CSS-класс элемента.
		 */
		initCls: function ()
		{
			var me = this,
				cls = '';

			if (me.baseCls || me.cls)
			{
				cls = me.baseCls ? me.baseCls : '';
				cls += cls ? ' ' + me.cls : me.cls;
			}

			me.cls = cls;
		},

		/**
		 * @protected
		 * Создает хэлпер для работы с отображением.
		 * @return {FBEditor.editor.helper.element.Node}
		 */
		createNodeHelper: function ()
		{
			var me = this,
				nodeHelper;

			nodeHelper = Ext.create('FBEditor.editor.helper.element.Node', me);
			me.nodeHelper = nodeHelper;

			return nodeHelper;
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

		/**
		 * Преобразует элемент в текст.
		 * @param {FBEditor.editor.element.AbstractElement} fragment Пустой элемент, в который будут помещаться
		 * необходимые результирующие элементы.
		 */
		convertToText: function (fragment)
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

					// конвертируем потомка
					child.convertToText(fragment);
				}

				if (child && (child.isStyleType || child.isText))
				{
					//console.log('child', pos, child.xmlTag);
					if (child.isStyleType)
					{
						// удаляем все неопределенные элементы
						child.removeUndefinedElements();
					}

					if (child.children.length)
					{
						// добавляем в контейнер текстовый элемент
						fragment.add(child);
					}
					else
					{
						pos++;
					}
				}
				else
				{
					// позиция следующего потомка
					pos++;
				}
			}
		},

		/**
		 * Удаляет все неопределенные элементы.
		 */
		removeUndefinedElements: function ()
		{
			var me = this,
				children = me.children,
				pos = 0,
				el;

			while (me.children.length && pos < me.children.length)
			{
				el = children[pos];

				if (el.isUndefined)
				{
					me.remove(el);
				}
				else
				{
					pos++;
				}
			}
		},

		/**
		 * Изменяет данные элемента перед копированием.
		 */
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

		/**
		 * Изменяет данные элемента после копирования.
		 */
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