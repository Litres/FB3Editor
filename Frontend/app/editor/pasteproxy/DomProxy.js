/**
 * Класс для работы с DOM, вставляемого в текст фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.DomProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.dom.SpanProxy'
		],
		
		/**
		 * @property {Object} Список альтернативных тегов html.
		 */
		altNames: {
			em: ['i', 'em'],
			strong: ['b', 'strong'],
			underline: ['u', 'underline']
		},

		/**
		 * @private
		 * @property {Node} DOM.
		 */
		dom: null,

		/**
		 * @private
		 * @property {Object} CSS-классы из DOM.
		 */
		css: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.PasteProxy} Прокси данных.
		 */
		pasteProxy: null,

		/**
		 * @param data {Object}
		 * @param {Node} data.dom DOM.
		 * @param {FBEditor.editor.pasteproxy.PasteProxy} data.pasteProxy Прокси данных.
		 */
		constructor: function (data)
		{
			var me = this;
			
			me.dom = data.dom;
			me.pasteProxy = data.pasteProxy;
		},

		/**
		 * Возвращает элемент, полученный путем преобразования DOM.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getElement: function ()
		{
			var me = this,
				dom = me.dom,
				body,
				el;

			// создаем CSS-классы из стилей DOM
			me.createCss();

			// создаем элемент
			body = dom.querySelector('fb3-body') || dom.querySelector('body');
			el = me.createElement(body);
			
			return el
		},

		/**
		 * @private
		 * Создает CSS-классы стилей из DOM.
		 */
		createCss: function ()
		{
			var me = this,
				dom = me.dom,
				styles;

			styles = dom.querySelectorAll('style');

			// парсим все классы
			Ext.Array.each(
				styles,
				function (style)
				{
					me.parseStyle(style.innerHTML);
				}
			);
		},

		/**
		 * @private
		 * Парсит текстовые классы, превращая их в объекты.
		 * @param {String} style Стили.
		 */
		parseStyle: function (style)
		{
			var me = this,
				css = me.css || {},
				nameCss,
				valCss,
				curCss,
				reg,
				res;

			// удаляем комментарии
			style = style.replace(/<!--|-->/g, '');
			style = style.replace(/[\s]{0,}\/\*(.*?)\*\/[\s]{0,}/g, '');

			// удаляем все переносы
			style = style.replace(/[\n]+/g, '');

			// выражение для получения всех классов
			reg = /[\s\n]{0,}(.*?)[\s\n]{0,}\{[\s\n]{0,}(.*?)[\s\n]{0,}\}/gm;

			while (res = reg.exec(style))
			{
				nameCss = res[1];
				valCss = res[2];

				// получаем массив свойств для класса
				valCss = valCss.split(/[\s]{0,};[\s]{0,}/);

				curCss = {};

				Ext.Array.each(
					valCss,
				    function (item)
				    {
					    var prop,
						    nameProp,
						    valProp;

					    if (item)
					    {
						    // сохраняем свойство и его значение
						    prop = item.split(/[\s]{0,}:[\s]{0,}/);
						    nameProp = prop[0];
						    valProp = prop[1];
						    curCss[nameProp] = valProp;
					    }
				    }
				);

				// добавляем класс
				css[nameCss] = css[nameCss] || [];
				css[nameCss].push(curCss);
			}

			Ext.log({level: 'info', msg: 'STYLES', dump: css});

			me.css = css;
		},

		/**
		 * @private
		 * Создает элемент из узла.
		 * При этом игнорируются узлы, которые не указаны в схеме тела книги.
		 * @param {Node} node Узел.
		 * @param {FBEditor.editor.element.AbstractElement} [parentEl] Родительский элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElement: function (node, parentEl)
		{
			var me = this,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				factory = manager.getFactory(),
				schema = manager.getSchema(),
				attributes = {},
				elementSchema,
				name,
				val,
				el;

			// создаем временный корневой элемент для элемента
			parentEl = parentEl || factory.createElement('body');

			// имя узла
			name = node.nodeName.toLowerCase();

			//console.log([name], node);
			//console.log(parentEl.xmlTag, parentEl);
			//console.log(parentEl.getXml());

			if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim())
			{
				// чистим текст
				val = me.cleanText(node);

				if (val)
				{
					el = factory.createElementText(val);
				}
			}
			else
			{
				if (name === 'span')
				{
					// пытаемся конвертировать span в другие элементы, учитывая его текущие CSS-стили
					name = me.convertSpan(node);
				}

				// получаем универсальное имя элемента, которое используется в схеме
				name = me.getNameElement(name);

				// данные элемента из схемы
				elementSchema = schema.elements[name];

				if (elementSchema)
				{
					// создаем вложенный родительский элемент

					// получаем разрашенные атрибуты
					attributes = me.getAttributes(node, elementSchema);

					// создаем элемент с аттрибутами
					el = factory.createElement(name, attributes);
				}
				else
				{
					// используем родительский элемент в качестве текущего
					el = parentEl;
				}

				if (node.childNodes.length)
				{
					// создаем дочерние элементы для текущего элемента
					Ext.Array.each(
						node.childNodes,
						function (child)
						{
							var childEl;

							childEl = me.createElement(child, el);

							if (childEl && !childEl.equal(el))
							{
								el.add(childEl);
							}
						}
					);
				}
			}

			return el;
		},

		/**
		 * @private
		 * Возвращает разрешенные аттрибуты для узла.
		 * @param {Node} node Узел.
		 * @param {Object} elementSchema Данные из схемы для элемента.
		 * @return {Object} Аттрибуты.
		 */
		getAttributes: function (node, elementSchema)
		{
			var attributes = {};

			Ext.Array.each(
				node.attributes,
				function (item)
				{
					var name = item.name,
						val = item.value;

					switch (name)
					{
						case 'xlink:href':
							name = 'href';
							break;
						case 'id':
							name = /^[_a-z0-9][0-9a-z._-]*$/i.test(val) ? name : null;
					}

					// соответствует ли аттрибут схеме
					if (name && Ext.isObject(elementSchema.attributes[item.name]) && val)
					{
						attributes[name] = val;
					}
				}
			);

			return attributes;
		},

		/**
		 * @private
		 * Пытается преобразовать span в другой элемент, возвращая новое имя узла.
		 * Преобразование основывается на текущих CSS-стилях span, полученных из DOM.
		 * @param {Node} node Узел span.
		 * @return {String|false} Имя нового элемента.
		 */
		convertSpan: function (node)
		{
			var me = this,
				spanProxy,
				name;

			spanProxy = FBEditor.editor.pasteproxy.dom.SpanProxy.getImplementation({node: node, domProxy: me});
			name = spanProxy.getNewName();

			return name;
		},

		/**
		 * @private
		 * Возвращает очищенный текст.
		 * @param {Node} node Текстовый узел.
		 */
		cleanText: function (node)
		{
			var t = node.nodeValue,
				reg = FBEditor.ExcludedCompiler.regexpUtf;

			if (node.previousSibling &&
			    node.previousSibling.nodeType === Node.COMMENT_NODE &&
			    node.previousSibling.nodeValue === 'EndFragment')
			{
				// пропускаем текстовый узел после завершающего комментария (для ворда)
				return false;
			}

			t = t.replace(/[\n\t\s]+/ig, ' ');
			t = t.replace(reg, '');

			return t;
		},

		/**
		 * @private
		 * Возвращает универсальное имя элемента по имени узла.
		 * Одному и тому же элементу могут соответствовать разные html-элементы.
		 * @example
		 * em=[em, i]
		 * strong=[strong, b]
		 * @param {String} nodeName Имя узла.
		 * @return {String|false} Имя элемента из схемы.
		 */
		getNameElement: function (nodeName)
		{
			var me = this,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				schema = manager.getSchema(),
				altNames = me.altNames,
				name;

			if (nodeName === 'span')
			{
				// жестко игнорим, ибо там только мусор
				return false;
			}
			else if (nodeName === 'fb3-title')
			{
				// преобразуем название элемента в title
				return 'title';
			}

			name = schema.elements[nodeName] ? nodeName : false;

			if (!name)
			{
				// ищем альтернативное имя
				Ext.Object.each(
					altNames,
				    function (key, names)
				    {
					    if (Ext.Array.contains(names, nodeName))
					    {
						    name = key;
						    return false;
					    }
				    }
				);
			}

			//console.log('nodeName, name', nodeName, name);

			return name;
		}
	}
);