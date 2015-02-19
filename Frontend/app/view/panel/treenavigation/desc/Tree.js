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
			'FBEditor.view.panel.treenavigation.desc.TreeController',
			'FBEditor.view.panel.treenavigation.desc.TreeStore'
		],
		id: 'panel-desc-navigation',
		xtype: 'panel-desc-navigation',
		controller: 'panel.desc.navigation',
		useArrows: true,
		animate: false,

		syncContentId: 'form-desc',

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.view.panel.treenavigation.desc.TreeStore');
			me.callParent(arguments);
		}
	}
);