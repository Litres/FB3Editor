/**
 * Пункт меню - Удалить строку.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.delRow.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.DelRowCommand'
		],
		
		xtype: 'main-editor-button-table-menu-delRow',

		text: 'Удалить строку',

		cmdName: 'DelRowCommand'
	}
);