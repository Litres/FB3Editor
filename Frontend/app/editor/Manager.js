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
			'FBEditor.editor.Factory'
		],

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Корневой элемент тела книги.
		 */
		content: null,

		selection: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Текущий выделенный элемент в редакторе.
		 */
		focusElement: null,

		/**
		 * @property {Boolean} Заморозить ли события вставки узлов.
		 */
		suspendEvent: false,

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
		 */
		setFocusElement: function (el)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps(),
				data;

			me.focusElement = el;
			me.selection = window.getSelection();

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
		 * Вставляет новый элемент на место курсора.
		 * @param {String} name Имя элемента.
		 */
		insertElement: function (name)
		{
			var me = this,
				el,
				sel = me.selection,
				range,
				node,
				els = {};

			if (sel)
			{
				range = sel.getRangeAt(0);
				node = range.endContainer.parentNode.parentNode;
				el = node.getElement();
				console.log('insert title', node, el);
				// создаем заголовок
				els.title = FBEditor.editor.Factory.createElement('title');
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Заголовок');
				els.p.add(els.t);
				els.title.add(els.p);
				el.add(els.title);
				FBEditor.editor.Manager.suspendEvent = true;
				node.appendChild(els.title.getNode(me.id));
				FBEditor.editor.Manager.suspendEvent = false;
			}
		}
	}
);