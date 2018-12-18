/**
 * Класс для хранения и работы с данными, полученных из выделения в тексте.
 * Аналогичен классу Range из window.getSelection().
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Range',
	{
		/**
		 * @property {Boolean} Свернуто ли выделение в каретку.
		 */
		collapsed: null,
		
		/**
		 * @property {Node} Родительский узел выделения.
		 */
		common: null,
		
		/**
		 * @property {Node} Начальный узел выделения.
		 */
		start: null,
		
		/**
		 * @property {Node} Конечный узел выделения.
		 */
		end: null,
		
		/**
		 * @property {Object} Данные смещения.
		 * @property {Number} Object.start Смещение в начальном узле.
		 * @property {Number} Object.end Смещение в конечном узле.
		 */
		offset: {
			start: null,
			end: null
		},
		
		/**
		 * @property {Function} Строковое представление выделения.
		 */
		toString: function () {return '';},
		
		/**
		 * @param {Object} range Данные выделения.
		 * @param {Node} range.common
		 * @param {Node} range.start
		 * @param {Node} range.end
		 * @param {Object} range.offset
		 * @param {Number} range.offset.start
		 * @param {Number} range.offset.end
		 * @param {Function} range.toString
		 */
		constructor: function (range)
		{
			var me = this;
			
			me.setData(range);
		},
		
		/**
		 * Нормализует и устанавливает данные выделения.
		 * @param {Object} range Данные.
		 */
		setData: function (range)
		{
			var me = this,
				offset = range.offset,
				helper,
				el;
			
			me.collapsed = range.collapsed;
			
			//реальный родительский узел
			el = range.common.getElement();
			helper = el.getNodeHelper();
			me.common = helper.getNode();
			
			// реальный начальный узел
			el = range.start.getElement();
			helper = el.getNodeHelper();
			me.start = helper.getNode();
			
			// реальное смещение в начальном узле с учетом оверлея
			offset.start = el.isText ? helper.getOffset(range.start, offset.start) : offset.start;
			
			// реальный конечный узел
			el = range.end.getElement();
			helper = el.getNodeHelper();
			me.end = helper.getNode();
			
			// реальное смещение в конечном узле с учетом оверлея
			offset.end = el.isText ? helper.getOffset(range.end, offset.end) : offset.end;
			
			me.offset = offset;
			me.toString = range.toString;
		}
	}
);