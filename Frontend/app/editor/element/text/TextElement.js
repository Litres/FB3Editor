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
			'FBEditor.editor.element.text.TextElementController',
			'FBEditor.editor.helper.element.TextNode'
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
		 * @private
		 * @property {String} Непечатаемый символ, который отображается вместо пробела в режиме отображения
		 * непечатаемых символов.
		 */
		unprintedSymbolSpace: '\u00b7',

		/**
		 * @private
		 * @property {String} Непечатаемый символ, который отображается вместо неразрывного пробела в режиме отображения
		 * непечатаемых символов.
		 */
		unprintedSymbolNbsp: '\u2022',

		/**
		 * @param {String} text Текст.
		 */
		constructor: function (text)
		{
			var me = this;

			me.elementId = Ext.id({prefix: me.prefixId});
			me.text = Ext.isString(text) ? text : me.text;

			me.createController();

            // заменяем сущности на спецсимволы
            me.text = Ext.String.htmlDecode(me.text);

           
            // преобразуем сущности
			me.text = me.text.replace(/&lt;/g, '<');
			me.text = me.text.replace(/&gt;/g, '>');
			
            /*
			// преобразуем сущность &nbsp; в пробел
			me.text = me.text.replace(/&nbsp;/g, " ");
			*/
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
			
			// преобразуем спецсимволы
			text = text.replace(/&/g, '&amp;');
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
		
		createNodeHelper: function ()
		{
			var me = this,
				nodeHelper;
			
			nodeHelper = Ext.create('FBEditor.editor.helper.element.TextNode', me);
			me.nodeHelper = nodeHelper;
			
			return nodeHelper;
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

			// заменяем непечатаемые символы
			me.text = me.convertUnprintedSymbols(text);
			
			if (viewportId)
			{
				helper = me.getNodeHelper();
				node = helper.getNode(viewportId);
				node.nodeValue = me.convertSpaces(text);
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
		 * Возвращает длину текста.
		 * @return {Number}
		 */
		getLength: function ()
		{
			return this.text.length;
		},

		/**
		 * Создает текстовый узел.
		 * @return {Node} Возвращает текстовый узел.
		 */
		createNode: function (viewportId)
		{
			var me = this,
				text,
				node;

			text = me.convertSpaces(me.text);
			node = document.createTextNode(text);
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
		},

		updateUnprintedSymbols: function ()
		{
			var me = this,
				text,
				helper;
			
			text = me.convertSpaces(me.text);

			// обновляем отображение элемента
			helper = me.getNodeHelper();
			helper.setNodeValue(text);
		},
		
		/**
		 * Добавляет подсветку в текст.
		 * @param {Object[]} pos Позиции подсветки.
		 * @param {Number} pos.start Начальная позиция.
		 * @param {Number} pos.end Конечная позиция.
		 * @param {Boolean} pos.selection Выделить ли совпадение.
		 * @param {String} cls CSS-класс подсветки.
		 */
		addOverlay: function (pos, cls)
		{
			var me = this,
				helper;
			
			helper = me.getNodeHelper();
			helper.addOverlay(pos, cls);
		},
		
		/**
		 * Удаляет подсветку в тексте.
		 * @param {String} cls CSS-класс подсветки.
		 */
		removeOverlay: function (cls)
		{
			var me = this,
				helper;
			
			helper = me.getNodeHelper();
			helper.removeOverlay(cls);
		},

		/**
		 * Заменяет все пробелы на непечатаемые символы при активном режиме отображения непечатаемых символов.
		 * @param {String} text Исходный текст.
		 * @return {String} Преобразованный текст.
		 */
		convertSpaces: function (text)
		{
			var me = this,
				newText = text,
				manager = me.getManager();

			if (manager && manager.isUnprintedSymbols())
			{
				newText = newText.replace(/ /g, me.unprintedSymbolSpace);
				newText = newText.replace(/\u00a0/g, me.unprintedSymbolNbsp); // &nbsp;
			}

			return newText;
		},

		/**
		 * @private
		 * Заменяет все непечатаемые символы на пробелы.
		 * @param {String} text Исходный текст.
		 * @return {String} Преобразованный текст.
		 */
		convertUnprintedSymbols: function (text)
		{
			var me = this,
				newText = text,
				reg;

			reg = new RegExp(me.unprintedSymbolSpace, 'g');
			newText = newText.replace(reg, ' ');
			reg = new RegExp(me.unprintedSymbolNbsp, 'g');
			newText = newText.replace(reg, '\u00a0'); // &nbsp;

			return newText;
		}
	}
);