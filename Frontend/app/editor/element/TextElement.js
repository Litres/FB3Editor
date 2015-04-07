/**
 * Текстовый элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.TextElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

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

			me.text = Ext.isString(text) ? text : me.text;
		},

		getNode: function ()
		{
			var me = this,
				node = me.node || me.createNode();

			me.node = node;

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
		createNode: function ()
		{
			var me = this,
				node;

			node = document.createTextNode(me.text);
			me.setNode(node);

			return node;
		}
	}
);