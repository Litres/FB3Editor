/**
 * Меню для кнопки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.Menu',
	{
		extend: 'Ext.menu.Menu',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.size.SizeMenu'
		],
		id: 'panel-toolstab-main-button-table-menu',
		xtype: 'panel-toolstab-main-button-table-menu',

		translateText: {
			insertTable: 'Вставить таблицу'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					text: me.translateText.insertTable,
					menu: Ext.create('FBEditor.view.panel.toolstab.main.button.table.menu.size.SizeMenu')
				}
			];

			me.callParent(arguments);
		}
	}
);