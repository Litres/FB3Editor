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
			'FBEditor.editor.helper.element.Node'
		],

		statics: {
			/**
			 * @property {Number} Количество оступов перед элементом в формируемом xml.
			 */
			countSpaces: 0
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
		 * @property {String} Класс для обработки выделения в браузере WebKit.
		 * Если не указан, то по умолчанию используется #selectionClass.
		 */
		selectionClassWebKit: '',

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
		 * @private
		 * @property {Object} Выделения FBEditor.editor.selection.Selection, привязанные к свои окнам.
		 */
		//selection: {},

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
			    function (item)
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
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		add: function (el, viewportId)
		{
			var me = this,
				nodes = {},
				helper;

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
			
			if (viewportId)
			{
				// добавляем узел
				
				helper = me.getNodeHelper();
				nodes.node = helper.getNode(viewportId);
				
				helper = el.getNodeHelper();
				nodes.child = helper.getNode(viewportId);
				
				nodes.node.appendChild(nodes.child);
			}
		},

		/**
		 * Вставляет новый дочерний элемент перед другим дочерним элементом.
		 * @param {FBEditor.editor.element.AbstractElement} el Вставляемый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} nextEl Элемент, перед которым происходит вставка.
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		insertBefore: function (el, nextEl, viewportId)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(nextEl),
				nodes = {},
				helper;

			if (el.parent)
			{
				// удаляем ссылку на вставляемый элемент из старого родителя
				el.parent.remove(el);
			}

			el.parent = me;
			children.splice(pos, 0, el);
			me.children = children;

			if (viewportId)
			{
				// вставляем узел

				helper = me.getNodeHelper();
				nodes.node = helper.getNode(viewportId);

				helper = el.getNodeHelper();
				nodes.child = helper.getNode(viewportId);

				helper = nextEl.getNodeHelper();
				nodes.next = helper.getNode(viewportId);

				nodes.node.insertBefore(nodes.child, nodes.next);
			}
		},

		/**
		 * Заменяет дочерний элемент на новый.
		 * @param {FBEditor.editor.element.AbstractElement} el Новый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} replacementEl Заменяемый элемент.
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		replace: function (el, replacementEl, viewportId)
		{
			var me = this,
				children = me.children,
				pos = me.getChildPosition(replacementEl),
				nodes = {},
				helper;

			if (el.parent)
			{
				// удаляем ссылку на заменяющий элемент из старого родителя
				el.parent.remove(el);
			}

			el.parent = me;
			me.remove(replacementEl);
			children.splice(pos, 1, el);
			me.children = children;

			if (viewportId)
			{
				// заменяем узел

				helper = me.getNodeHelper();
				nodes.node = helper.getNode(viewportId);

				helper = el.getNodeHelper();
				nodes.newChild = helper.getNode(viewportId);

				helper = replacementEl.getNodeHelper();
				nodes.oldChild = helper.getNode(viewportId);

				nodes.node.replaceChild(nodes.newChild, nodes.oldChild);
			}
		},

		/**
		 * Удаляет дочерний элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		remove: function (el, viewportId)
		{
			var me = this,
				children = me.children,
				nodes = {},
				helper,
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

					children.splice(pos, 1);
					me.children = children;

					if (viewportId)
					{
						// удаляем узел

						helper = me.getNodeHelper();
						nodes.node = helper.getNode(viewportId);

						helper = el.getNodeHelper();
						nodes.child = helper.getNode(viewportId);

						try
						{
							nodes.node.removeChild(nodes.child);
						}
						catch (e)
						{
							Ext.log(
								{
									msg: 'Попытка удалить узел непринадлежащий элементу',
									level: 'warn',
									dump: e
								}
							);
						}
					}
				}
			}
		},

		/**
		 * Переносит всех потомков на уровень выше, а опустевший элемент удаляет.
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		upChildren: function (viewportId)
		{
			var me = this,
				parent = me.parent;

			while (me.first())
			{
				parent.insertBefore(me.first(), me, viewportId);
			}

			parent.remove(me, viewportId);
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
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		removeAll: function (viewportId)
		{
			var me = this,
				children = me.children,
				el;

			while (children.length)
			{
				el = children[0];
				me.remove(el, viewportId);
			}
		},

		/**
		 * Перебирает всех потомков, передавая их в функцию.
		 * @param {Function} fn Функция-итератор.
		 * @param {Object} [scope] Область видимости.
		 */
		each: function (fn, scope)
		{
			var me = this,
				pos = 0,
				child;

			scope = scope || me;

			while (pos < me.children.length)
			{
				child = me.children[pos];
				pos++;
				fn.apply(scope, [child, pos - 1]);
			}

			//Ext.Array.each(this.children, fn);
		},

		/**
		 * Удаляет все связи элемента на используемые объекты.
		 */
		clear: function ()
		{
			//
		},

		/**
		 * Вызывает метод контроллера по имени события.
		 * @param {String} name Имя события.
		 * @param {Object} e Объект события.
		 * @param {Object} opts Дополнительные опции.
		 */
		fireEvent: function (name, e, opts)
		{
			var me = this,
				controller = me.controller,
				evtName;

			evtName = 'on' + Ext.String.capitalize(name);

			//console.log(name, arguments);

			controller[evtName].apply(controller, [e, opts]);
		},

		/**
		 * Клонирует элемент.
		 * @param {Object} opts Опции клонирования.
		 * @param {Boolean} [opts.ignoredText] Пропускать ли клонирование текста.
		 * @param {Boolean} [opts.ignoredDeep] Пропускать ли клонирование дочерних элементов.
		 * @return {FBEditor.editor.element.AbstractElement} Клонированный элемент.
		 */
		clone: function (opts)
		{
			var me = this,
				children = me.children,
				factory = FBEditor.editor.Factory,
				attr,
				newEl,
				ignoredText,
				ignoredDeep;

			ignoredText = opts && opts.ignoredText ? true : false;
			ignoredDeep = opts && opts.ignoredDeep ? true : false;

			if (me.isText && ignoredText)
			{
				return null;
			}

			// аттрибуты
			attr = me.attributes;

			// создаем новый элемент
			newEl = me.isText ? factory.createElementText(me.text) :
			        factory.createElement(me.getName(), attr);

			if (!ignoredDeep)
			{
				// клонируем дочерние элементы
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
		 * Возвращает элемент в виде строки xml.
		 * @param {Boolean} [withoutText] Надо ли исключить текст из xml.
		 * @param {Boolean} [withoutFormat] Надо ли исключить форматирование xml.
		 * @return {String}
		 */
		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				children = me.children,
				tag = me.xmlTag,
				self = FBEditor.editor.element.AbstractElement,
				nlBefore = '',
				nlAfter = '',
				spacesBefore = '',
				spacesAfter = '',
				formatOptions = {},
				xml,
				attr;

			if (!withoutFormat)
			{
				// получаем опции для форматирования xml
				formatOptions = me.getFormatOptionsXml();
				spacesBefore = formatOptions.spacesBefore;
				spacesAfter = formatOptions.spacesAfter;
				nlBefore = formatOptions.nlBefore;
				nlAfter = formatOptions.nlAfter;
			}

			try
			{
				// получаем аттрибуты
				attr = me.getAttributesXml(withoutText);
			}
			catch (e)
			{
				attr = '';
			}

			xml = spacesBefore + '<' + tag;
			xml += attr ? ' ' + attr : '';

			if (me.marker)
			{
				xml += '>\n' + spacesBefore + '  ' + me.marker.getXml(withoutText, withoutFormat);
			}

			if (children && children.length)
			{
				// счётчик количества пробелов перед тегом
				self.countSpaces++;

				xml += me.marker ? '' : '>' + nlBefore;

				Ext.Array.each(
					children,
					function (item)
					{
						xml += item.getXml(withoutText, withoutFormat);
					}
				);

				xml += spacesAfter + '</' + tag + '>' + nlAfter;

				self.countSpaces--;
			}
			else
			{
				xml += me.marker ? '\n' + spacesAfter + '</' + tag + '>\n' : '/>' + nlAfter;
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
				helper = me.getNodeHelper(),
				node,
				data,
				el;

			node = helper.getNode();

			// текущий выделенный элемент
			//el = me.isImg ? me : me.getBlock();
			el = me.isText || me.isBr ? me.parent : me;

			data = {
				el: el,
				elementName: el.getName().toUpperCase(),
				htmlPath: me.getHtmlPath(node) // путь html от курсора
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
				helper = me.getNodeHelper(),
				viewportId,
				oldNode,
				newNode;

			if (me.nodes)
			{
				me.style = '';

				// обновляем узлы элемента
				viewportId = Ext.Object.getKeys(me.nodes)[0];
				oldNode = helper.getNode(viewportId);
				manager.setSuspendEvent(true);
				newNode = me.getNode(viewportId);
				oldNode.parentNode.replaceChild(newNode, oldNode);
				me.sync(viewportId);
				manager.setSuspendEvent(false);
			}
		},

		/**
		 * Обновляет отображение непечатаемых символов.
		 */
		updateUnprintedSymbols: function ()
		{
			var me = this;
			
			me.each(
				function (child)
				{
					child.updateUnprintedSymbols();
				}
			);
		},

		/**
		 * Устанавливает обработчики событий узла элемента.
		 * @param {Node} element Узел элемента.
		 * @return {Node} element Узел элемента.
		 */
		setEvents: function (element)
		{
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

			while (el.isStyleType || el.isText || el.isImg)
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
		 * Возвращает выделение.
		 * @param {String} viewportId Айди окна.
		 * @return {FBEditor.editor.selection.Selection}
		 */
		getSelection: function (viewportId)
		{
			return this.selection[viewportId];
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
			editor = root && root.getEditor ? root.getEditor() : null;

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
				manager,
				helper,
				editor;

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
		 * @param {Boolean} [separatedHolder] Разделять ли текстовое содержимое абзацев пробелами.
		 * @return {String} Текст.
		 */
		getText: function (separatedHolder)
		{
			var me = this,
				text = '';

			me.each(
				function (child)
				{
					text += child.isText ? child.getText() : child.getText(separatedHolder);
				}
			);

			text += separatedHolder && text && me.isStyleHolder ? ' ' : '';

			return text;
		},

		/**
		 * Возвращает название элемента для отображения в узле дерева навигации по тексту.
		 * @return {String} Название.
		 */
		getNameTree: function ()
		{
			var me = this,
				first = me.first(),
				name = '';

			if (first && first.hisName('title'))
			{
				name += first.getText(true);
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
		 * Возвращает список дочерних элементов, которые имеют определенные имена.
		 * @param {String} name Имя искомых элементов.
		 * @param {Boolean} [deep=false] Искать ли во вложенных элементах.
		 * @return {Array} Список найденных элементов.
		 */
		getChildrenByName: function (name, deep)
		{
			var me = this,
				arr = [];

			if (me.hisName(name))
			{
				arr = Ext.Array.push(arr, me);
			}

			me.each(
				function (child)
				{
					var childArr;
					
					if (child.hisName(name))
					{
						arr = Ext.Array.push(arr, child);
					}

					childArr = child.getChildrenByName(name, deep);

					if (childArr.length)
					{
						arr = Ext.Array.push(arr, childArr);
					}
				}
			);

			return arr;
		},

		/**
		 * Является ли элемент блочным.
		 * @returns {Boolean}
		 */
		isBlock: function ()
		{
			var me = this,
				isBlock;
			
			isBlock = me.isStyleHolder || !me.isStyleType && !me.isCell && !me.isTr && !me.isText && !me.isImg;
			
			return isBlock;
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
		 * Является ли элемент первым в родителе.
		 * @return {Boolean}
		 */
		isFirst: function ()
		{
			var me = this,
				isFirst;

			isFirst = me.equal(me.parent.first());

			return isFirst;
		},

		/**
		 * Является ли элемент последним в родителе.
		 * @return {Boolean}
		 */
		isLast: function ()
		{
			var me = this,
				isLast;
			
			isLast = me.equal(me.parent.last());
			
			return isLast;
		},

		/**
		 * Находится ли текущая начальная точка выделения в начале элемента.
		 * @param {Range} range Выделение.
		 * @return {Boolean}
		 */
		isStartRange: function (range)
		{
			var me = this,
				text = me.getText(),
				rangeStr = range.toString(),
				isStart;

			isStart = (rangeStr.indexOf(text) === 0) || (text.indexOf(rangeStr) === 0);

			return isStart;
		},

		/**
		 * Находится ли текущая конечная точка выделения в конце элемента.
		 * @param {Range} range Выделение.
		 * @return {Boolean}
		 */
		isEndRange: function (range)
		{
			var me = this,
				text = me.getText(),
				rangeStr = range.toString(),
				isEnd;

			isEnd = (rangeStr.lastIndexOf(text) === rangeStr.length - text.length) ||
			        (text.lastIndexOf(rangeStr) === text.length - rangeStr.length);

			return isEnd;
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
		 * TODO переместить реализацию в helper
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
		 * TODO переместить реализацию в helper
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
		},

		/**
		 * @protected
		 * Возвращает опции для форматирования xml.
		 * @return {Object}
		 * @return {String} Object.spacesBefore Количество пробелов перед открывающимся тегом.
		 * @return {String} Object.spacesAfter Количество пробелов перед закрывающимся тегом.
		 * @return {String} Object.nlBefore Символ новой строки после открывающегося тега.
		 * @return {String} Object.nlBefore Символ новой строки после закрывающегося тега.
		 */
		getFormatOptionsXml: function ()
		{
			var self = FBEditor.editor.element.AbstractElement,
				countSpaces = self.countSpaces,
				formatOptions = {};

			try
			{
				// отступы
				formatOptions.spacesBefore = countSpaces ? new Array(countSpaces).join('  ') : '';
				formatOptions.spacesAfter = countSpaces ? new Array(countSpaces).join('  ') : '';
			}
			catch (e)
			{
				formatOptions.spacesBefore = '';
				formatOptions.spacesAfter = '';
				self.countSpaces = 1;
			}

			// символы новой строки
			formatOptions.nlBefore = '\n';
			formatOptions.nlAfter = '\n';


			return formatOptions;
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

			try
			{
				Ext.Object.each(
					me.attributes,
					function (key, val)
					{
						attr += key + '="' + val + '" ';
					}
				);
			}
			catch (e)
			{
				attr = '';
			}

			return attr.trim();
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
				selectionClass = me.selectionClass,
				selectionClassWebKit = me.selectionClassWebKit,
				selection;

			if (selectionClass || selectionClassWebKit)
			{
				try
				{
					selectionClass = Ext.isWebKit && selectionClassWebKit ? selectionClassWebKit : selectionClass;
					selection = Ext.create(selectionClass, node);
				}
				catch (e)
				{
					selection = Ext.create(me.selectionClass, node);

					Ext.log(
						{
							msg: 'Необходимо создать класс ' + selectionClass,
							level: 'error'
						}
					);
				}
				
				// выделение привязывается к узлу отображения
				me.selection = me.selection || {};
				me.selection[node.viewportId] = selection;
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
		}
	}
);