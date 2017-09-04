/**
 * Пункт меню - Вставить столбец слева.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.insertColPrev.Item',
	{
		extend: 'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertColPrevCommand'
		],
		
		xtype: 'main-editor-button-table-menu-insertColPrev',

		text: 'Вставить столбец слева',

		cmdName: 'InsertColPrevCommand'
	}
);