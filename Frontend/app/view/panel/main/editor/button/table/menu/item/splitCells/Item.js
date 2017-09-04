/**
 * Пункт меню - Отменить объединение ячеек.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.splitCells.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.menu.item.splitCells.ItemController',
			'FBEditor.editor.command.table.SplitCellsCommand'
		],
		
		xtype: 'main-editor-button-table-menu-splitCells',
		controller: 'main.editor.button.table.menu.item.splitCells',

		text: 'Разъединить ячейку',

		cmdName: 'SplitCellsCommand'
	}
);