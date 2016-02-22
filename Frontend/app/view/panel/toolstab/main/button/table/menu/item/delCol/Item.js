/**
 * Пункт меню - Удалить столбец.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.delCol.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.DelColCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-delCol',
		xtype: 'panel-toolstab-main-button-table-menu-delCol',

		text: 'Удалить столбец',

		cmdName: 'DelColCommand'
	}
);