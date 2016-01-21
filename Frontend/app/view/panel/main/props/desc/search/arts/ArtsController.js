/**
 * Контроллер родительского контейнера с результатами поиска произведений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.arts.ArtsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.props.desc.search.arts',

		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				containerItems;

			view.setVisible(true);
			containerItems = view.getContainerItems();
			containerItems.fireEvent('loadData', params);
		}
	}
);