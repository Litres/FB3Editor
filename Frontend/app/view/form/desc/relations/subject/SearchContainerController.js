/**
 * Контроллер контейнера поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.SearchContainerController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.container.search',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView();

			view.setVisible(true);
		}
	}
);