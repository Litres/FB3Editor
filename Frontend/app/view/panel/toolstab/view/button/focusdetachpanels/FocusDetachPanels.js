/**
 * Кнопка отображения отсоединенных панелей.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.view.button.focusdetachpanels.FocusDetachPanels',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-view-button-focusdetachpanels',
		xtype: 'panel-toolstab-view-button-focusdetachpanels',
		text: 'Показать отсоединенные панели',
		handler: function ()
		{
			// поднимаем наверх отсоединенные панели
			Ext.getCmp('main').fireEvent('focusDetachPanels');
		}
	}
);