/**
 * Пункт меню - Вставить столбец слева.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertColPrev.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertColPrevCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-insertColPrev',
		xtype: 'panel-toolstab-main-button-table-menu-insertColPrev',

		text: 'Вставить столбец слева',

		cmdName: 'InsertColPrevCommand'
	}
);