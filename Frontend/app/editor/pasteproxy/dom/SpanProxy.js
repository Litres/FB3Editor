/**
 * Прокси для узла span.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.dom.SpanProxy',
	{
		statics: {
			/**
			 * Возвращает объект.
			 * @param data
			 * @return {FBEditor.editor.pasteproxy.dom.SpanProxy}
			 */
			getImplementation: function (data)
			{
				var me = this,
					self;
				
				self = me.self || Ext.create('FBEditor.editor.pasteproxy.dom.SpanProxy', data);
				self.node = data.node;
				self.domProxy = data.domProxy;
				me.self = self;
				
				return self;
			},

			/**
			 * @private
			 * @property {FBEditor.editor.pasteproxy.dom.SpanProxy}
			 */
			self: null
		},
		
		/**
		 * @property {Object} Карта преобразований span к другим элементам, в зависимости от текущих CSS-стилей span.
		 * Каждая запись содержит ключ CSS-свойства, его значение и название элемента.
		 */
		mapStyleSpan: {
			'font-weight': {
				bold: 'strong',
				'700': 'strong' // google doc
			},
			'font-style': {
				italic: 'em'
			},
			'text-decoration': {
				underline: 'underline',
				'none underline': 'underline',
				'line-through': 'strikethrough'
			},
			'letter-spacing': {
				pattern: /\d+(\.\d+)?(\w{2})/,
				el: 'spacing'
			}
		},

		/**
		 * @private
		 * @property {Node} Узел span.
		 */
		node: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.DomProxy} Прокси DOM.
		 */
		domProxy: null,

		/**
		 * @param data {Object}
		 * @param {Node} data.node Узел span.
		 * @param {FBEditor.editor.pasteproxy.DomProxy} data.domProxy Прокси DOM.
		 */
		constructor: function (data)
		{
			var me = this;
			
			me.node = data.node;
			me.domProxy = data.domProxy;
		},

		/**
		 * Возвращает новое имя элемента.
		 * @return {String|false} Имя.
		 */
		getNewName: function ()
		{
			var me = this,
				mapStyleSpan = me.mapStyleSpan,
				name = false,
				clsStyles,
				styles;

			// получаем стили из класса
			clsStyles = me.getClassStyles();

			// получаем встроенные стили
			styles = me.getStyles();

			// объединяем все стили
			clsStyles = Ext.Object.merge(clsStyles, styles);

			//console.log('styles', clsStyles);

			// ищем совпадение стилей в карте преобразований
			Ext.Object.each(
				mapStyleSpan,
			    function (nameProp, prop)
			    {
				    if (clsStyles[nameProp])
				    {
					    if (prop.pattern)
					    {
						    // проверяем по шаблону
						    if (prop.pattern.test(clsStyles[nameProp]))
						    {
							    name = prop.el;
							    return false;
						    }
					    }
					    else if (prop[clsStyles[nameProp]])
					    {
						    name = prop[clsStyles[nameProp]];
						    return false;
					    }
				    }
			    }
			);

			//console.log('name', name);

			return name;
		},

		/**
		 * Возвращает встроенные стили по аттрибуту style узла span.
		 * @return {Object} Стили.
		 */
		getStyles: function ()
		{
			var me = this,
				node = me.node,
				styles = {},
				style;

			// получаем список классов
			style = node.getAttribute('style');

			if (style)
			{
				style = style.split(/[\s]{0,};[\s]{0,}/);

				Ext.Array.each(
					style,
					function (item)
					{
						var prop,
							nameProp,
							valProp;

						if (item)
						{
							// свойство и его значение
							prop = item.split(/[\s]{0,}:[\s]{0,}/);
							nameProp = prop[0];
							valProp = prop[1];
							styles[nameProp] = valProp;
						}
					}
				);
			}

			return styles
		},

		/**
		 * Возвращает стили по аттрибуту class узла span.
		 * @return {Object} Стили.
		 */
		getClassStyles: function ()
		{
			var me = this,
				node = me.node,
				domProxy = me.domProxy,
				css = domProxy.css,
				styles = {},
				classes;

			// получаем список классов
			classes = node.getAttribute('class');

			if (classes && css)
			{
				classes = classes.split(/[ ]+/);

				// перебираем все классы и получаем все свойства
				Ext.Array.each(
					classes,
					function (clsName)
					{
						if (clsName)
						{
							if (css[clsName])
							{
								styles = Ext.Object.merge(styles, Ext.clone(css[clsName][0]));
							}

							clsName = 'span.' + clsName;

							if (css[clsName])
							{
								styles = Ext.Object.merge(styles, Ext.clone(css[clsName][0]));
							}
						}
					}
				);
			}

			return styles;
		}
	}
);