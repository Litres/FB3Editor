/**
 * Меню для кнопки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.Menu',
	{
		extend: 'Ext.menu.Menu',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.menu.MenuController',
			'FBEditor.view.panel.main.editor.button.table.menu.item.delCol.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.delRow.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.delTable.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.joinCells.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.insertColNext.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.insertColPrev.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.insertRowNext.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.insertRowPrev.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.insertTable.Item',
			'FBEditor.view.panel.main.editor.button.table.menu.item.splitCells.Item'

		],
		id: 'main-editor-button-table-menu',
		xtype: 'main-editor-button-table-menu',
		controller: 'main.editor.button.table.menu',

		listeners: {
			sync: 'onSync'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'main-editor-button-table-menu-insertTable'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'main-editor-button-table-menu-insertRowPrev'
				},
				{
					xtype: 'main-editor-button-table-menu-insertRowNext'
				},
				{
					xtype: 'main-editor-button-table-menu-insertColPrev'
				},
				{
					xtype: 'main-editor-button-table-menu-insertColNext'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'main-editor-button-table-menu-delRow'
				},
				{
					xtype: 'main-editor-button-table-menu-delCol'
				},
				{
					xtype: 'main-editor-button-table-menu-delTable'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'main-editor-button-table-menu-joinCells'
				},
				{
					xtype: 'main-editor-button-table-menu-splitCells'
				}
			];

			me.callParent(arguments);
		}
	}
);