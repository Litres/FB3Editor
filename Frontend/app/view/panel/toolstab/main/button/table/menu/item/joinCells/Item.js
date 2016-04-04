/**
 * Пункт меню - Объединить ячейки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.joinCells.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.joinCells.ItemController',
			'FBEditor.editor.command.table.JoinCellsCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-joinCells',
		xtype: 'panel-toolstab-main-button-table-menu-joinCells',
		controller: 'panel.toolstab.main.button.table.menu.item.joinCells',

		text: 'Объединить ячейки',

		cmdName: 'JoinCellsCommand'
	}
);