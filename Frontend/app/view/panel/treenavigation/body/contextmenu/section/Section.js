/**
 * Контекстное меню секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.Section',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.Inner',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.join.Join',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.left.Left',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.next.Next',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.right.Right'
		],
		
		xtype: 'contextmenu-treenavigation-body-section',
		
		getItems: function ()
		{
			var items;
			
			items = [
				{
					xtype: 'contextmenu-treenavigation-body-section-inner'
				},
				{
					xtype: 'contextmenu-treenavigation-body-section-next'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'contextmenu-treenavigation-body-section-join'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'contextmenu-treenavigation-body-section-right'
				},
				{
					xtype: 'contextmenu-treenavigation-body-section-left'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'contextmenu-treenavigation-body-item-editelement'
				},
				{
					xtype: 'contextmenu-treenavigation-body-item-editsource'
				}
			];
			
			return items;
		}
	}
);