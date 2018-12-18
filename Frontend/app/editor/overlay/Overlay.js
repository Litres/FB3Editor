/**
 * Объект подсветки в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.overlay.Overlay',
	{
		config: {
			/**
			 * @cfg {Object[]} Данные для подсветки.
			 * @cfg {FBEditor.editor.element.AbstractElement} cfg.el Элемент.
			 * @cfg {Number[]} cfg.pos Начальная позиция совпадения.
			 */
			data: null,
			
			/**
			 * @cfg {String} CSS-класс подсветки.
			 */
			cls: 'overlay-default'
		},
		
		constructor: function (cfg)
		{
			var me = this;
			
			me.initConfig(cfg);
		},
		
		/**
		 * Перебирает все данные, передавая их в функцию.
		 * @param {Function} fn Функция-итератор.
		 * @param {Object} [scope] Область видимости.
		 */
		each: function (fn, scope)
		{
			var me = this,
				data = me.getData(),
				pos = 0,
				item;
			
			scope = scope || me;
			
			while (pos < data.length)
			{
				item = data[pos];
				pos++;
				fn.apply(scope, [item, pos - 1]);
				data = me.getData();
			}
		}
	}
);