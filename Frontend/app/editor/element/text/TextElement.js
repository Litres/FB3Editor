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
		 * @param {String} text Текст.
		 */
		constructor: function (text)
		{
			var me = this;

			me.elementId = Ext.id({prefix: me.prefixId});
			me.mixins.observable.constructor.call(me, {});
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

		getXml: function (withoutText)
		{
			var me = this,
				text;

			text = withoutText ? '' : me.text;

			// заменяем спецсимволы <, > на сущности
			text = text.replace(/</g, '&#60;');
			text = text.replace(/>/g, '&#62;');

			// преобразуем последовательность пробелов в цепочку из пробелов и сущности &nbsp;
			text = text.replace(/[ ]{2}/g, '  &#160;');
			text = text.replace(/^ | $/g, ' &#160;');

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
		 */
		setText: function (text)
		{
			this.text = text;
		},

		getText: function ()
		{
			return this.text;
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
		}
	}
);