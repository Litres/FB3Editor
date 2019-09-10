/**
 * DOM-прокси по умолчанию, для неизвестного источника копирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.DomProxyDefault',
	{
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
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		manager: null,
		
		/**
		 * @private
		 * @property {Node} Корневой узел фрагмента.
		 */
		body: null,
		
		/**
		 * @private
		 * @property {Object} CSS-классы из DOM.
		 */
		css: null,
		
		/**
		 * @param data
		 * @param {FBEditor.editor.Manager} data.manager Менеджер редактора.
		 * @param {Node} data.body Корневой узел фрагмента.
		 * @param {Object} data.css CSS-классы из DOM..
		 */
		constructor: function (data)
		{
			var me = this;
			
			me.manager = data.manager;
			me.body = data.body;
			me.css = data.css;
		},
		
		/**
		 * Возвращает менедежр редактора текста.
		 * @return {FBEditor.editor.Manager}
		 */
		getManager: function ()
		{
			return this.manager;
		},
		
		/**
		 * Возвращает элемент, полученный путем преобразования DOM.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getElement: function ()
		{
			var me = this,
				body = me.body,
				el;
			
			el = me.createElement(body);
			
			return el;
		},
		
		/**
		 * @protected
		 * Создает элемент из узла.
		 * При этом игнорируются узлы, которые не указаны в схеме тела книги.
		 * @param {Node} node Узел.
		 * @param {FBEditor.editor.element.AbstractElement} [parentEl] Родительский элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElement: function (node, parentEl)
		{
			var me = this,
				manager = me.getManager(),
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
					
					if (!name)
					{
						// получаем текст
						val = me.cleanText(node.textContent);
						
						if (val)
						{
							// создаем текстовый элемент вместо span
							el = factory.createElementText(val);
						}
						
						return el;
					}
				}
				
				// получаем универсальное имя элемента, которое используется в схеме
				name = me.getNameElement(name);
				
				// данные элемента из схемы
				elementSchema = schema.elements[name];
				
				if (elementSchema)
				{
					// создаем вложенный родительский элемент
					
					// получаем разрешенные атрибуты
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
		 * @protected
		 * Возвращает очищенный текст.
		 * @param {Node|String} node Текстовый узел или текст.
		 * @return {String}
		 */
		cleanText: function (node)
		{
			var reg = FBEditor.ExcludedCompiler.regexpUtf,
				t;
			
			if (node.nodeValue)
			{
				t = node.nodeValue;
				
				if (node.previousSibling &&
					node.previousSibling.nodeType === Node.COMMENT_NODE &&
					node.previousSibling.nodeValue === 'EndFragment')
				{
					// пропускаем текстовый узел после завершающего комментария (для ворда)
					return false;
				}
			}
			else
			{
				t = node;
			}
			
			t = t.replace(/[\n\t\s]+/ig, ' ');
			t = t.replace(reg, '');
			
			return t;
		},
		
		/**
		 * @protected
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
		 * @protected
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
				//pasteProxy = me.pasteProxy,
				manager = me.getManager(),
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
			else if (/^h[1-9]+/i.test(nodeName))
			{
				return 'p';
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
		},
		
		/**
		 * @protected
		 * Возвращает разрешенные аттрибуты для узла.
		 * @param {Node} node Узел.
		 * @param {Object} elementSchema Данные из схемы для элемента.
		 * @return {Object} Аттрибуты.
		 */
		getAttributes: function (node, elementSchema)
		{
			var attributes = {};
			
			if (elementSchema.attributes)
			{
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
								name = /^[_a-z][0-9a-z._-]*$/i.test(val) ? name : null;
						}
						
						// соответствует ли аттрибут схеме
						if (name && Ext.isObject(elementSchema.attributes[item.name]) && val)
						{
							attributes[name] = val;
						}
					}
				);
			}
			
			return attributes;
		}
	}
);