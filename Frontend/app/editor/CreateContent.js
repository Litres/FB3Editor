/**
 * Класс для преобразвания загруженного контента в элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.CreateContent',
	{
		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Созданный контент.
		 */
		content: null,

		/**
		 * Создает контент из строки.
		 * @param {String} content Исходный объект в виде строки, которую необходимо преобразовать в реальный объект.
		 */
		constructor: function (content)
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

			//console.log(content);

			// преобразование строки в объект
			eval('me.content = ' + content);
		},

		/**
		 * Возвращает контент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getContent: function ()
		{
			return this.content;
		}
	}
);