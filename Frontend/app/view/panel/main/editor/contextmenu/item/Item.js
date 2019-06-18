/**
 * Пункт меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.Item',
	{
		extend: 'FBEditor.view.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.ItemController'
		],
		
		xtype: 'contextmenu-main-editor-item',
		controller: 'contextmenu.main.editor.item',
		
		getElement: function ()
		{
			var me = this,
				contextmenu = me.getContextMenu(),
				el;
			
			el = contextmenu.getElement();
			
			return el;
		}
	}
);