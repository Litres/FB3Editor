/**
 * Пункт меню - Отменить объединение ячеек.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.splitCells.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.splitCells.ItemController',
			'FBEditor.editor.command.table.SplitCellsCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-splitCells',
		xtype: 'panel-toolstab-main-button-table-menu-splitCells',
		controller: 'panel.toolstab.main.button.table.menu.item.splitCells',

		text: 'Разъединить ячейку',

		cmdName: 'SplitCellsCommand'
	}
);