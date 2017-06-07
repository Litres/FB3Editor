/**
 * Контроллер контейнера поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.SearchContainerController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.object.container.search',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				descManager = FBEditor.desc.Manager;

			if (!descManager.isLoadedData())
			{
				// если данные не загружены, то показываем поле поиска
				view.setVisible(true);
			}
		}
	}
);