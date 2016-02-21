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
			'FBEditor.view.panel.toolstab.main.button.table.menu.MenuController',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.delCol.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.delRow.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.delTable.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.joinCells.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertColNext.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertColPrev.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertRowNext.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertRowPrev.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertTable.Item',
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.sepCells.Item'

		],
		id: 'panel-toolstab-main-button-table-menu',
		xtype: 'panel-toolstab-main-button-table-menu',
		controller: 'panel.toolstab.main.button.table.menu',

		listeners: {
			sync: 'onSync'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-toolstab-main-button-table-menu-insertTable'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-insertRowPrev'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-insertRowNext'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-insertColPrev'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-insertColNext'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-delRow'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-delCol'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-delTable'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-joinCells'
				},
				{
					xtype: 'panel-toolstab-main-button-table-menu-sepCells'
				}
			];

			me.callParent(arguments);
		}
	}
);