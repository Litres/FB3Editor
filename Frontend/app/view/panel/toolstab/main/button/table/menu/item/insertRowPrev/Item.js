/**
 * Пункт меню - Вставить строку выше.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertRowPrev.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertRowPrevCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-insertRowPrev',
		xtype: 'panel-toolstab-main-button-table-menu-insertRowPrev',

		text: 'Вставить строку выше',

		cmdName: 'InsertRowPrevCommand'
	}
);