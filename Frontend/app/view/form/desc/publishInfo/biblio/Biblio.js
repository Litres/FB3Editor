/**
 * Библиографическое описание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.biblio.Biblio',
	{
		extend: 'FBEditor.view.form.desc.editor.Editor',

		xtype: 'form-desc-biblio-description',

		rootElementName: 'desc:biblio-description',

		/**
		 * Возвращает имя компонента.
		 * @return {String}
		 */
		getName: function ()
		{
			return this.name;
		},

		/**
		 * Загружает данные в редактор.
		 * @param {String} data Данные.
		 */
		loadData: function (data)
		{
			var me = this,
				manager = FBEditor.desc.Manager,
				rootElementName = me.getRootElementName();

			data = '<' + rootElementName +
			       ' xmlns:desc="http://www.fictionbook.org/FictionBook3/description">' + data +
			       '</' + rootElementName +  '>';

			manager.createContentEditor(me, data);
		}
	}
);