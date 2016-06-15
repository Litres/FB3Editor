/**
 * Пункт меню - Объединить ячейки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.joinCells.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.menu.item.joinCells.ItemController',
			'FBEditor.editor.command.table.JoinCellsCommand'
		],
		id: 'main-editor-button-table-menu-joinCells',
		xtype: 'main-editor-button-table-menu-joinCells',
		controller: 'main.editor.button.table.menu.item.joinCells',

		text: 'Объединить ячейки',

		cmdName: 'JoinCellsCommand'
	}
);