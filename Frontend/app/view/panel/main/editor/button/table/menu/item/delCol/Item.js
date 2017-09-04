/**
 * Пункт меню - Удалить столбец.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.delCol.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.DelColCommand'
		],
		
		xtype: 'main-editor-button-table-menu-delCol',

		text: 'Удалить столбец',

		cmdName: 'DelColCommand'
	}
);