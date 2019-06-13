/**
 * Пункт контекстного меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.contextmenu.item.Item',
	{
		extend: 'Ext.menu.Item',
		requires: [
			'FBEditor.view.contextmenu.item.ItemController'
		],
		
		xtype: 'contextmenu-item',
		controller: 'contextmenu.item',
		
		listeners: {
			click: 'onClick'
		},
		
		icon: null,
		
		/**
		 * Возвращает контекстное меню.
		 * @return {FBEditor.view.contextmenu.ContextMenu}
		 */
		getContextMenu: function ()
		{
			var me = this,
				menu;
			
			menu = me.up('contextmenu');
			
			return menu;
		}
	}
);