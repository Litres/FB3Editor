/**
 * Контекстное меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.contextmenu.ContextMenu',
	{
		extend: 'Ext.menu.Menu',
		requires: [
			'FBEditor.view.contextmenu.ContextMenuController'
		],
		
		xtype: 'contextmenu',
		controller: 'contextmenu',
		
		listeners: {
			contextmenu: 'onContextMenu'
		},
		
		autoShow: true,
		
		afterRender: function ()
		{
			var me = this;
			
			// отслеживаем событие contextmenu
			me.getEl().on(
				{
					contextmenu: function (evt)
					{
						this.fireEvent('contextmenu', evt);
					},
					scope: me
				}
			);
			
			me.callParent(arguments);
		}
	}
);