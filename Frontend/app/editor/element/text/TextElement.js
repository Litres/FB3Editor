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

		/**
		 * @property {String} Текст.
		 */
		text: '',

		/**
		 * @param {String} text Текст.
		 */
		constructor: function (text)
		{
			var me = this;

			me.mixins.observable.constructor.call(me, {});
			me.text = Ext.isString(text) ? text : me.text;
			me.createController();
		},

		getNode: function (viewportId)
		{
			var me = this,
				node;

			node = me.createNode(viewportId);

			return node;
		},

		getXml: function ()
		{
			return this.text;
		},

		/**
		 * Устанавливает текст элемента.
		 * @param {String} text Текст.
		 */
		setText: function (text)
		{
			var me = this;

			me.text = text;
		},

		/**
		 * Создает текстовый узел.
		 * @return {HTMLElement} Возвращает текстовый узел.
		 */
		createNode: function (viewportId)
		{
			var me = this,
				node;

			node = document.createTextNode(me.text);
			node.viewportId = viewportId;
			me.setNode(node);

			return node;
		}
	}
);