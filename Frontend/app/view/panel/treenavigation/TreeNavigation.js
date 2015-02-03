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
			'FBEditor.view.panel.resources.navigation.Navigation'
		],
		id: 'panel-treenavigation',
		xtype: 'panel-treenavigation',
		controller: 'panel.treenavigation',
		layout: 'card',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-resources-navigation'
				}
			];
			me.callParent(arguments);
		}
	}
);