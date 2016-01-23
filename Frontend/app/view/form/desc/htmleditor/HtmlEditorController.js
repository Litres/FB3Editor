/**
 * Контроллер редактора html.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.htmleditor.HtmlEditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.htmleditor',

		onPaste: function (data)
		{
			var me = this,
				view = me.getView();

			view.stripTags();
		}
	}
);