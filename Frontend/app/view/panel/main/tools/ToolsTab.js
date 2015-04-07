/**
 * Вкладки панели инструментов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.tools.ToolsTab',
	{
		extend: 'Ext.tab.Panel',
		requires: [
			'FBEditor.view.panel.main.tools.ToolsTabController',
			'FBEditor.view.panel.toolstab.file.File',
			'FBEditor.view.panel.toolstab.main.Main',
			'FBEditor.view.panel.toolstab.view.View',
			'FBEditor.view.panel.toolstab.tools.Tools'
		],
		id: 'panel-main-toolstab',
		xtype: 'panel-main-toolstab',
		controller: 'panel.main.toolstab',
		activeTab: 'panel-toolstab-main',
		items: [
			{
				xtype: 'panel-toolstab-file'
			},
			{
				xtype: 'panel-toolstab-main'
			},
			{
				xtype: 'panel-toolstab-view'
			},
			{
				xtype: 'panel-toolstab-tools'
			}
		]
	}
);