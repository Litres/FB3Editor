/**
 * Пункт меню.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItem',
	{
		extend: 'Ext.menu.Item',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItemController'
		],
		xtype: 'panel-toolstab-main-button-table-menu-item',
		controller: 'panel.toolstab.main.button.table.menu.item',

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