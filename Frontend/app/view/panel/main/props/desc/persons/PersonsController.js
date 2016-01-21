/**
 * Контроллер контейнера с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.persons.PersonsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.props.desc.persons',

		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				containerItems;

			containerItems = view.getContainerItems();

			// сохраняем параметры запроса для повторных запросов
			containerItems.params = Ext.clone(params);

			containerItems.fireEvent('loadData', params);
		}
	}
);