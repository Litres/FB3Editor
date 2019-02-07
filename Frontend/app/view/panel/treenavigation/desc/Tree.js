/**
 * Дерево навигации по описанию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.desc.Tree',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTree',
		requires: [
            'FBEditor.command.OpenDesc',
			'FBEditor.view.panel.treenavigation.desc.TreeController',
			'FBEditor.view.panel.treenavigation.desc.TreeStore'
		],

		id: 'panel-desc-navigation',
		xtype: 'panel-desc-navigation',
		controller: 'panel.desc.navigation',

		useArrows: true,
		animate: false,

		syncContentId: 'form-desc',
        cmdName: 'FBEditor.command.OpenDesc',

		initComponent: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				routeManager = bridge.FBEditor.route.Manager;

			// скрываем
			me.hidden = routeManager.isSetParam('only_text');
			
			me.store = Ext.create('FBEditor.view.panel.treenavigation.desc.TreeStore');
			me.callParent(arguments);
		}
	}
);