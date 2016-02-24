/**
 * Пункт меню - Удалить таблицу.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.delTable.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.DeleteCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-delTable',
		xtype: 'panel-toolstab-main-button-table-menu-delTable',

		text: 'Удалить таблицу',

		cmdName: 'DeleteCommand'
	}
);