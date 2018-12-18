/**
 * Объект результата поиска, содержащий данные конкретного совпадения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.search.cursor.Result',
	{
		config: {
			/**
			 * @cfg {FBEditor.editor.element.AbstractElement} Элемент, в котором найдено совпадение.
			 */
			el: null,
			
			/**
			 * @cfg {Object[]} Позиция совпадения.
			 * @cfg {Number} Object.start Начальная позиция.
			 * @cfg {Number} Object.end Конечная позиция.
			 * @cfg {Boolean} Object.selection Выделить ли совпадение.
			 */
			pos: null
		},
		
		/**
		 * @param {Object} data Данные совпадения.
		 * @param {FBEditor.editor.element.AbstractElement} data.el Элемент, в котором найдено совпадение.
		 * @param {Number[]} data.pos Начальная позиция совпадения.
		 * @param {Number} data.length Длина совпадения.
		 */
		constructor: function (data)
		{
			var me = this;
			
			me.initConfig(data);
		},
		
		/**
		 * Перебирает все найденные позиции совпадения, передавая их в функцию.
		 * @param {Function} fn Функция-итератор.
		 * @param {Object} [scope] Область видимости.
		 * @param {Boolean} [reverse] Перебирать в обратном порядке.
		 */
		each: function (fn, scope, reverse)
		{
			var me = this,
				results = me.getPos(),
				pos = 0,
				res;
			
			scope = scope || me;
			
			if (!reverse)
			{
				while (pos < results.length)
				{
					res = results[pos];
					pos++;
					
					if (fn.apply(scope, [res, pos - 1]))
					{
						// прерываем цикл
						break;
					}
				}
			}
			else
			{
				pos = results.length - 1;
				
				while (pos >= 0)
				{
					res = results[pos];
					pos--;
					
					if (fn.apply(scope, [res, pos + 1]))
					{
						// прерываем цикл
						break;
					}
				}
			}
		}
	}
);