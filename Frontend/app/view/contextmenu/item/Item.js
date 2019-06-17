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
		
		initComponent: function ()
		{
			var me = this;
			
			if (!me.isActive())
			{
				me.disabled = true;
			}
			
			me.callParent(arguments);
		},
		
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
		},
		
		/**
		 * Возвращает активный менеджер редактора текста.
		 */
		getEditorManager: function ()
		{
			return FBEditor.getEditorManager();
		},
		
		/**
		 * Активен ли пункт меню.
		 * @return {Boolean}
		 */
		isActive: function ()
		{
			return true;
		}
	}
);