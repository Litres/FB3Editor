/**
 * Дерево навигации по контенту центральной части, в заисимости от того какой контекст выбран
 * (редактирование заголовка, текста или ресурсов).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.TreeNavigation',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.treenavigation.TreeNavigationController',
			'FBEditor.view.panel.resources.navigation.Navigation',
			'FBEditor.view.panel.treenavigation.desc.Tree',
			'FBEditor.view.panel.treenavigation.body.Tree'
		],
		id: 'panel-treenavigation',
		xtype: 'panel-treenavigation',
		controller: 'panel.treenavigation',
		layout: 'anchor',
		defaults: {
			anchor: '100%'
		},
		listeners: {
			clearSelection: 'onClearSelection'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-desc-navigation'
				},
				{
					xtype: 'panel-body-navigation'
				},
				{
					xtype: 'panel-resources-navigation'
				}
			];
			me.callParent(arguments);
		}
	}
);