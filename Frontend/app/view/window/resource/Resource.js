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
		//minWidth: 400,
		//minHeight: 400,
		width: '80%',
		height: 400,
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

			// указываем, что панель находится в окне, чтобы избежать переключения центральной части
			panelResourcesNavigation.inWindow = true;

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

			panelResourcesNavigation.inWindow = false;

			// возвращаем панель навигации ресурсов в панель навигации
			panelTreenavigation.insert(1, panelResourcesNavigation);

			// возвращаем панель управления ресурсов в центральную часть
			panelResources.add(panelResourcesControl, viewResources);

			me.callParent(arguments);
		},

		getWindowPanelResourcesNavigation: function ()
		{
			var bridge = FBEditor.getBridgeWindow();

			return bridge.Ext.getCmp('window-panel-resources-navigation');
		},

		getWindowPanelResources: function ()
		{
			var bridge = FBEditor.getBridgeWindow();

			return bridge.Ext.getCmp('window-panel-resources');
		},

		getPanelTreenavigation: function ()
		{
			var bridgeNav = FBEditor.getBridgeNavigation();

			return bridgeNav.Ext.getCmp('panel-treenavigation');
		},

		getPanelResourcesNavigation: function ()
		{
			var bridgeNav = FBEditor.getBridgeNavigation();

			return bridgeNav.Ext.getCmp('panel-resources-navigation');
		},

		getPanelResources: function ()
		{
			var bridge = FBEditor.getBridgeWindow();

			return bridge.Ext.getCmp('panel-resources');
		},

		getPanelResourcesControl: function ()
		{
			var bridge = FBEditor.getBridgeWindow();

			return bridge.Ext.getCmp('panel-resources-control');
		},

		getViewResources: function ()
		{
			var bridge = FBEditor.getBridgeWindow();

			return bridge.Ext.getCmp('view-resources');
		}
	}
);