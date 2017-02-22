/**
 * Текстовый элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.text.TextElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.text.TextElementController'
		],
		controllerClass: 'FBEditor.editor.element.text.TextElementController',

		showedOnTree: false,

		/**
		 * @property {String} Текст.
		 */
		text: '',

		/**
		 * @property {Boolean} Текстовый ли элемент.
		 */
		isText: true,

		/**
		 * @private
		 * @property {Object[]} Координаты каждого символа относительно окна браузера.
		 */
		mapCoords: null,

		/**
		 * @param {String} text Текст.
		 */
		constructor: function (text)
		{
			var me = this;

			me.elementId = Ext.id({prefix: me.prefixId});
			me.text = Ext.isString(text) ? text : me.text;

			me.createController();

			// заменяем сущности на спецсимволы <, >
			me.text = me.text.replace(/&lt;/g, '<');
			me.text = me.text.replace(/&gt;/g, '>');

			// преобразуем сущность &nbsp; в пробел
			me.text = me.text.replace(/&nbsp;/g, " ");
		},

		getNode: function (viewportId)
		{
			var me = this,
				node;

			node = me.createNode(viewportId);

			return node;
		},

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				text;

			text = withoutText ? '' : me.text;

			// заменяем спецсимволы <, > на сущности
			text = text.replace(/</g, '&lt;');
			text = text.replace(/>/g, '&gt;');

			// преобразуем последовательность пробелов в цепочку из пробелов и сущности &nbsp;
			//text = text.replace(/[ ]{2}/g, '  &#160;');
			//text = text.replace(/^ | $/g, ' &#160;');
			
			return text;
		},

		sync: function (viewportId)
		{
			var me = this,
				manager = me.getManager();

			manager.setSuspendEvent(true);

			Ext.Object.each(
				me.nodes,
				function (id, node)
				{
					if (id !== viewportId)
					{
						node.nodeValue = me.getText();
					}
				}
			);

			manager.setSuspendEvent(false);
		},

		/**
		 * Устанавливает текст элемента.
		 * @param {String} text Текст.
		 * @param {String} [viewportId] Айди окна. Если передан, то затрагивает узел отображения.
		 */
		setText: function (text, viewportId)
		{
			var me = this,
				helper,
				node;
			
			me.text = text;
			
			if (viewportId)
			{
				helper = me.getNodeHelper();
				node = helper.getNode(viewportId);
				node.nodeValue = text;
			}
			
			me.clearMapCoords();
		},

		/**
		 * Возвращает текстовое содержимое элемента.
		 * @param {String} [start] Начальная позиция в тексте. Если не передано, то считается от начала текста.
		 * @param {String} [end] Конечная позиция в тексте. Если не передано, то считается до конца текста.
		 * @return {String} Текст.
		 */
		getText: function (start, end)
		{
			var me = this,
				text;

			text = me.text;
			
			if (start !== undefined || end !== undefined)
			{
				start = start !== undefined ? start : 0;
				end = end !== undefined ? end : text.length;
				start = (start < 0 || start > text.length) ? 0 : start;
				end = (end < 0 || end > text.length) ? text.length : end;
				text = text.substring(start, end);
			}
			
			return text;
		},

		/**
		 * Создает текстовый узел.
		 * @return {Node} Возвращает текстовый узел.
		 */
		createNode: function (viewportId)
		{
			var me = this,
				node;

			node = document.createTextNode(me.text);
			node.viewportId = viewportId;
			me.setNode(node);

			return node;
		},

		isEmpty: function ()
		{
			return this.text ? false : true;
		},

		/**
		 * Устанавливает новую карту координат символов.
		 * @param map {Object[]} Координаты каждого символа относительно окна браузера.
		 */
		setMapCoords: function (map)
		{
			this.mapCoords = map;
		},

		/**
		 * Возвращает карту координат символов.
		 * @return {Object[]}
		 */
		getMapCoords: function ()
		{
			return this.mapCoords;
		},

		/**
		 * Сбрасывает карту координат символов.
		 */
		clearMapCoords: function ()
		{
			this.mapCoords = null;
		}
	}
);