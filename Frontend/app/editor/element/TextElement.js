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

		getHtml: function ()
		{
			return this.text;
		}
	}
);