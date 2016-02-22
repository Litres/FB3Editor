/**
 * Пункт меню - Удалить строку.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.delRow.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.DelRowCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-delRow',
		xtype: 'panel-toolstab-main-button-table-menu-delRow',

		text: 'Удалить строку',

		cmdName: 'DelRowCommand'
	}
);