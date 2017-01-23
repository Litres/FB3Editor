/**
 * Класс для работы с DOM, вставляемого в текст фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.DomProxy',
	{
		/**
		 * @property {Object} Список альтернативных имен тегов html.
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

			body = dom.querySelector('body');
			el = me.createElement(body);
			
			return el
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
				val = node.nodeValue;
				el = factory.createElementText(val);
			}
			else
			{
				// получаем универсальное имя элемента, которое используется в схеме
				name = me.getNameElement(name);

				// данные элемента из схемы
				elementSchema = schema.elements[name];

				if (elementSchema)
				{
					// создаем вложенный родительский элемент

					// аттрибуты
					Ext.Array.each(
						node.attributes,
						function (item)
						{
							// соответствует ли аттрибут схеме
							if (Ext.isObject(elementSchema.attributes[item.name]) ||
							    Ext.Array.contains(['href'], item.name) &&
							    elementSchema.attributes['xlink:href'])
							{
								attributes[item.name] = item.value;
							}
						}
					);

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