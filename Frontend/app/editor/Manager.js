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

		content: null,

		/**
		 * Создает контент из загруженной книги.
		 * @param {String} content Исходный объект тела книги в виде строки, которую необходимо преобразовать
		 * в настоящий объект.
		 */
		createContent: function (content)
		{
			var me = this,
				сon,
				ce,
				ct,
				html;

			// сокращенные формы методов создания элементов
			ce = function (el, ch)
			{
				return FBEditor.editor.Factory.createElement(el, ch);
			};

			ct = function (text)
			{
				return FBEditor.editor.Factory.createElementText(text);
			};

			content = content.replace(/\s+/g, ' ');
			content = content.replace(/\), ?]/g, ')]');

			// преобразование строки в объект
			eval('me.content = ' + content);

			html = me.content.getHtml();
			//console.log(html);
			Ext.getCmp('main-htmleditor').fireEvent('loadtext', html);
		}
	}
);