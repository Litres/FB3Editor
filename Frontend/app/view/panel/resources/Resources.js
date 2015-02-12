/**
 * Панель ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.Resources',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.resources.ResourcesController',
			'FBEditor.view.panel.resources.view.ResourcesView',
			'FBEditor.view.panel.resources.control.Control'
		],
		id: 'panel-resources',
		xtype: 'panel-resources',
		controller: 'panel.resources',
		autoScroll: true,
		bodyPadding: 5,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-resources-control'
				},
				{
					xtype: 'view-resources'
				}
			];
			me.callParent(arguments);
		}
	}
);