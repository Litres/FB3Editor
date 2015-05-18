/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Manager',
	{
		singleton: 'true',
		requires: [
			'FBEditor.editor.schema.Schema',
			'FBEditor.editor.Factory',
			'FBEditor.editor.HistoryManager'
		],

		/**
		 * @property {FBEditor.editor.schema.Schema} Правила проверки элементов.
		 */
		schema: null,

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Корневой элемент тела книги.
		 */
		content: null,

		/**
		 * @property {Selection} Текущее выделение в теле книги.
		 */
		selection: null,

		/**
		 * @property {Boolean} Заморозить ли события вставки узлов.
		 */
		suspendEvent: false,

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Текущий выделенный элемент в редакторе.
		 */
		focusElement: null,

		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;

			me.schema = Ext.create('FBEditor.editor.schema.Schema');
		},

		/**
		 * Создает контент из загруженной книги.
		 * @param {String} content Исходный объект тела книги в виде строки, которую необходимо преобразовать
		 * в настоящий объект.
		 */
		createContent: function (content)
		{
			var me = this,
				ce,
				ct;

			// сокращенные формы методов создания элементов
			ce = function (el, attr, ch)
			{
				return FBEditor.editor.Factory.createElement(el, attr, ch);
			};
			ct = function (text)
			{
				return FBEditor.editor.Factory.createElementText(text);
			};

			content = content.replace(/\s+/g, ' ');
			content = content.replace(/\), ?]/g, ')]');
			//console.log(content);

			// преобразование строки в объект
			eval('me.content = ' + content);

			// сбрасываем историю
			FBEditor.editor.HistoryManager.clear();

			// загружаем контент
			Ext.getCmp('main-editor').fireEvent('loadData');
		},

		/**
		 * Возвращает html тела книги.
		 * @return {HTMLElement}
		 */
		getNode: function (viewportId)
		{
			var me = this,
				content = me.content,
				node;

			FBEditor.editor.Manager.suspendEvent = true;
			node = content.getNode(viewportId);
			FBEditor.editor.Manager.suspendEvent = false;

			return node;
		},

		/**
		 * Возвращает xml тела книги.
		 * @return {String} Строка xml.
		 */
		getXml: function ()
		{
			var me = this,
				content = me.content,
				xml;

			xml = content.getXml();
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			console.log(xml);

			return xml;
		},

		/**
		 * Создает корневой элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Корневой элемент.
		 */
		createRootElement: function ()
		{
			var me = this,
				root;

			root = FBEditor.editor.Factory.createElement('fb3-body');
			me.content = root;

			return root;
		},

		/**
		 * Устанавливает текущий выделенный элемент в редакторе.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 * @param {Selection} sel
		 */
		setFocusElement: function (el, sel)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps(),
				data;

			me.focusElement = el;
			me.selection = sel || window.getSelection();

			// показываем информацию о выделенном элементе
			data = el.getData();
			bridgeProps.Ext.getCmp('panel-props-body').fireEvent('loadData', data);
		},

		/**
		 * Возвращает текущий выделенный элемент в редакторе.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getFocusElement: function ()
		{
			return this.focusElement;
		},

		/**
		 * Удаляет все ссылки на узлы для конкретного окна.
		 * @param {String} viewportId Id окна.
		 */
		removeNodes: function (viewportId)
		{
			var me = this,
				rootEl = me.content;

			rootEl.removeNodes(viewportId);
		},

		/**
		 * Создает новый элемент в теле книги.
		 * @param {String} name Имя элемента.
		 */
		createElement: function (name)
		{
			var me = this,
				el,
				sel;

			sel = me.getSelection();
			if (sel)
			{
				el = FBEditor.editor.Factory.createElement(name);
				el.fireEvent('createElement', sel);
			}
		},

		/**
		 * Возвращает текущее выделение в теле книги.
		 * @return {Selection} Текущее выделение в теле книги.
		 */
		getSelection: function ()
		{
			return this.selection;
		},

		/**
		 * Возвращает правила проверки элементов.
		 * @return {FBEditor.editor.schema.Schema}
		 */
		getSchema: function ()
		{
			return this.schema;
		}
	}
);