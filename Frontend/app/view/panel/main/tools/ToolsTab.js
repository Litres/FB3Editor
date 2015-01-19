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
			'FBEditor.view.htmleditor.toolbar.Toolbar',
			'FBEditor.view.panel.toolstab.file.File',
			'FBEditor.view.panel.toolstab.main.Main'
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
			}
		]
	}
);