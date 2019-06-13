/**
 * Пункт контекстного меню дерева навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
	{
		extend: 'FBEditor.view.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.item.ItemController'
		],
		
		xtype: 'contextmenu-treenavigation-body-item',
		controller: 'contextmenu.treenavigation.body.item',
		
		getElement: function ()
		{
			var me = this,
				contextmenu = me.getContextMenu(),
				el;
			
			el = contextmenu.getElement();
			
			return el;
		},
		
		/**
		 * Возвращает дерево навигации по тексту.
		 * @return {FBEditor.view.panel.treenavigation.body.Tree}
		 */
		getTreePanel: function ()
		{
			var me = this,
				panel;
			
			panel = Ext.getCmp('panel-body-navigation');
			
			return panel;
		},
		
		/**
		 * Возвращает дерево навигации по xml.
		 * @return {FBEditor.view.panel.treenavigation.xml.Tree}
		 */
		getXmlTreePanel: function ()
		{
			var me = this,
				panel;
			
			panel = Ext.getCmp('panel-xml-navigation');
			
			return panel;
		}
	}
);