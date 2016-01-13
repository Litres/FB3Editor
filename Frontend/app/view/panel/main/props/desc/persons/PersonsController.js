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

		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				panelPersons;

			panelPersons = view.getPanelPersons();
			panelPersons.params = Ext.clone(data);
			panelPersons.fireEvent('loadData', data);
		}
	}
);