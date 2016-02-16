/**
 * Кнопка вставки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.Table',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.TableController',
			'FBEditor.view.panel.toolstab.main.button.table.menu.Menu'
		],
		id: 'panel-toolstab-main-button-table',
		xtype: 'panel-toolstab-main-button-table',
		controller: 'panel.toolstab.main.button.table',
		html: '<i class="fa fa-table fa-lg"></i>',
		tooltip: 'Таблица',
		elementName: 'table',

		initComponent: function ()
		{
			var me = this;

			me.menu = Ext.create('FBEditor.view.panel.toolstab.main.button.table.menu.Menu');

			me.callParent(arguments);
		}
	}
);