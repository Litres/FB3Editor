/**
 * Пункт меню - Вставить строку ниже.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.insertRowNext.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertRowNextCommand'
		],
		id: 'main-editor-button-table-menu-insertRowNext',
		xtype: 'main-editor-button-table-menu-insertRowNext',

		text: 'Вставить строку ниже',

		cmdName: 'InsertRowNextCommand'
	}
);