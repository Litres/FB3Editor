/**
 * Окно проводника ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.resource.Resource',
	{
		extend: 'Ext.Window',
		xtype: 'window-resource',
		id: 'window-resource',
		title: 'Выбор ресурса',
		width: '80%',
		height: '80%',
		modal: true,
		closeAction: 'hide',
		layout: 'border',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel',
					id: 'window-panel-resources-navigation',
					region: 'west',
					split: {
						size: 2
					},
					width: 200,
					minWidth: 200,
					bodyPadding: 5,
					overflowY: 'auto'
				},
				{
					xtype: 'panel',
					id: 'window-panel-resources',
					region: 'center',
					bodyPadding: 5,
					overflowY: 'auto',
					cls: 'window-panel-resources'
				}
			];
			me.callParent(arguments);
		},

		beforeShow: function ()
		{
			var me = this,
				windowPanelResourcesNavigation = me.getWindowPanelResourcesNavigation(),
				windowPanelResources = me.getWindowPanelResources(),
				panelResourcesNavigation = me.getPanelResourcesNavigation(),
				panelResourcesControl = me.getPanelResourcesControl(),
				viewResources = me.getViewResources();

			// перемещаем панели ресурсов в окно
			windowPanelResourcesNavigation.add(panelResourcesNavigation);
			windowPanelResources.add(panelResourcesControl, viewResources);

			me.callParent(arguments);
		},

		onHide: function ()
		{
			var me = this,
				panelTreenavigation = me.getPanelTreenavigation(),
				panelResourcesNavigation = me.getPanelResourcesNavigation(),
				panelResources = me.getPanelResources(),
				panelResourcesControl = me.getPanelResourcesControl(),
				viewResources = me.getViewResources();

			// возвращаем панели ресурсов в центральную часть
			panelTreenavigation.insert(1, panelResourcesNavigation);
			panelResources.add(panelResourcesControl, viewResources);

			me.callParent(arguments);
		},

		getWindowPanelResourcesNavigation: function ()
		{
			return Ext.getCmp('window-panel-resources-navigation');
		},

		getWindowPanelResources: function ()
		{
			return Ext.getCmp('window-panel-resources');
		},

		getPanelTreenavigation: function ()
		{
			return Ext.getCmp('panel-treenavigation');
		},

		getPanelResources: function ()
		{
			return Ext.getCmp('panel-resources');
		},

		getPanelResourcesNavigation: function ()
		{
			return Ext.getCmp('panel-resources-navigation');
		},

		getPanelResourcesControl: function ()
		{
			return Ext.getCmp('panel-resources-control');
		},

		getViewResources: function ()
		{
			return Ext.getCmp('view-resources');
		}
	}
);