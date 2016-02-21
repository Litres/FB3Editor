/**
 * Пункт меню - Вставить строку ниже.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertRowNext.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertRowNextCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-insertRowNext',
		xtype: 'panel-toolstab-main-button-table-menu-insertRowNext',

		text: 'Вставить строку ниже',

		cmdName: 'InsertRowNextCommand'
	}
);