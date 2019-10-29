/**
 * Абстрактный класс прокси для узла.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.dom.AbstractProxy',
	{
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
		 * @private
		 * @property {Node} Узел.
		 */
		node: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.DomProxy} Прокси DOM.
		 */
		domProxy: null,
		
		/**
		 * @private
		 * @property {String|Boolean} Имя узла.
		 */
		name: null,
		
		/**
		 * Возвращает новое имя элемента.
		 * Вернет false - в случае, если преобразование не найдено.
		 * @return {String|Boolean} Имя.
		 */
		getNewName: function ()
		{
			var me = this,
				mapStyleSpan = me.mapStyle,
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
			me.setName(name);
			
			return name;
		},
		
		/**
		 * Устанавливает имя узла.
		 * @param {String|Boolean} name
		 */
		setName: function (name)
		{
			this.name = name;
		},
		
		/**
		 * Возвращает имя узла.
		 * @return {String}
		 */
		getName: function ()
		{
			return this.name;
		},
		
		/**
		 * Возвращает встроенные стили по аттрибуту style узла.
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
		 * Возвращает стили по аттрибуту class узла.
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