/**
 * Контроллер контейнера с результатами поиска названий произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.arts.ArtsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.props.desc.arts',

		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				panelArts;

			panelArts = view.getPanelArts();
			panelArts.fireEvent('loadData', data);
		}
	}
);