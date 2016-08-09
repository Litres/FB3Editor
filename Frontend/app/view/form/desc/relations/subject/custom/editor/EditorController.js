/**
 * Контроллер контейнера, содержащего компоненты ручного ввода.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.editor.EditorController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.custom.editor',

		onAccessHub: function ()
		{
			//console.log('access hub');
		}
	}
);