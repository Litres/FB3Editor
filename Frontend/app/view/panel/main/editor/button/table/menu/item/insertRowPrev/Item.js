/**
 * Пункт меню - Вставить строку выше.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.insertRowPrev.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertRowPrevCommand'
		],
		
		xtype: 'main-editor-button-table-menu-insertRowPrev',

		text: 'Вставить строку выше',

		cmdName: 'InsertRowPrevCommand'
	}
);