/**
 * Контроллер текстового поля для фамилии/имени/отчества..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.NameController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.name',

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				title;

			title = view.getTitle();
			title.autoValue();
		}
	}
);