/**
 * Добавление вложенной секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.Inner',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.InnerController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-inner',
		controller: 'contextmenu.treenavigation.body.section.inner',
		
		text: 'Добавить вложенную главу',
		
		initComponent: function ()
		{
			var me = this,
				el,
				helper,
				node;
			
			el = me.getElement();
			helper = el.getNodeHelper();
			node = helper.getNode();
			
			if (!node)
			{
				// если секция не зарендерина, то пункт меню неаткивен
				me.disabled = true;
			}
			
			me.callParent(arguments);
		}
	}
);