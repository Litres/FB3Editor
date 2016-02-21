/**
 * Пункт меню - Вставить таблицу.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertTable.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.size.SizeMenu'
		],
		id: 'panel-toolstab-main-button-table-menu-insertTable',
		xtype: 'panel-toolstab-main-button-table-menu-insertTable',

		text: 'Вставить таблицу',

		initComponent: function ()
		{
			var me = this;

			me.menu = Ext.create('FBEditor.view.panel.toolstab.main.button.table.menu.size.SizeMenu');

			me.callParent(arguments);
		}
	}
);