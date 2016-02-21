/**
 * Пункт меню - Вставить столбец справа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.insertColNext.Item',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
		requires: [
			'FBEditor.editor.command.table.InsertColNextCommand'
		],
		id: 'panel-toolstab-main-button-table-menu-insertColNext',
		xtype: 'panel-toolstab-main-button-table-menu-insertColNext',

		text: 'Вставить столбец справа',

		cmdName: 'InsertColNextCommand'
	}
);