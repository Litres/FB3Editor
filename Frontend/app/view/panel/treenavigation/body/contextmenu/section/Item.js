/**
 * Пункт меню секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.ItemController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-item',
		controller: 'contextmenu.treenavigation.body.section.item',
		
		isActive: function ()
		{
			var me = this,
				active = true,
				el,
				helper,
				node;
			
			el = me.getElement();
			helper = el.getNodeHelper();
			node = helper.getNode();
			
			if (!node)
			{
				// если секция не зарендерина, то пункт меню неактивен
				active = false;
			}
			
			return active;
		}
	}
);