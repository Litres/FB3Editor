/**
 * Дерево навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.Tree',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTree',
		requires: [
			'FBEditor.view.panel.treenavigation.body.TreeController',
			'FBEditor.view.panel.treenavigation.body.TreeStore'
		],
		id: 'panel-body-navigation',
		xtype: 'panel-body-navigation',
		controller: 'panel.body.navigation',
		useArrows: true,
		animate: false,

		syncContentId: 'main-htmleditor',

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.view.panel.treenavigation.body.TreeStore');
			me.callParent(arguments);
		}
	}
);