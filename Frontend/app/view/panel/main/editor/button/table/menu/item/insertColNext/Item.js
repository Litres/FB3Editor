/**
 * Пункт меню - Вставить столбец справа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.insertColNext.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertColNextCommand'
		],
		id: 'main-editor-button-table-menu-insertColNext',
		xtype: 'main-editor-button-table-menu-insertColNext',

		text: 'Вставить столбец справа',

		cmdName: 'InsertColNextCommand'
	}
);