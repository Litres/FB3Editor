/**
 * Контроллер родительского контейнера с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.persons.PersonsController',
	{
		extend: 'FBEditor.view.panel.main.props.desc.search.ContainerController',
		alias: 'controller.props.desc.search.persons',

		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				containerItems;

			view.setVisible(true);
			containerItems = view.getContainerItems();

			// сохраняем параметры запроса для повторных запросов
			containerItems.params = Ext.clone(params);

			containerItems.fireEvent('loadData', params);
		}
	}
);