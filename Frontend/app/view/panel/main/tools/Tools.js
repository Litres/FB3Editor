/**
 * Панель инструментов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.tools.Tools',
	{
		extend: 'FBEditor.view.panel.main.Abstract',
		requires: [
			'FBEditor.view.panel.main.tools.ToolsController',
			'FBEditor.view.htmleditor.toolbar.Toolbar',
			'FBEditor.view.panel.toolstab.file.File',
			'FBEditor.view.panel.toolstab.main.Main'
		],
		id: 'panel-main-tools',
		xtype: 'panel-main-tools',
		controller: 'panel.main.tools',
		panelName: 'tools',
		region: 'north',
		bodyPadding: 0,
		stateful: false,
		split: false,
		height: 75,
		items: [
			{
				xtype: 'tabpanel',
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
		]
    }
);