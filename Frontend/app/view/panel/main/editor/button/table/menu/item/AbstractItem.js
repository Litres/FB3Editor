/**
 * Пункт меню.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItem',
	{
		extend: 'Ext.menu.Item',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.menu.item.AbstractItemController'
		],
		xtype: 'main-editor-button-table-menu-item',
		controller: 'main.editor.button.table.menu.item',

		/**
		 * @property {String} Название команды.
		 */
		cmdName: '',

		/**
		 * @property {Object} Опции для команды.
		 */
		cmdOpts: {},

		listeners: {
			click: 'onClick',
			sync: 'onSync'
		}
	}
);