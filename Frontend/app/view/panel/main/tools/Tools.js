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
			'FBEditor.view.panel.main.tools.ToolsTab'
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
		margin: '0 0 4px 0',
		items: [
			{
				xtype: 'panel-main-toolstab'
			}
		]
    }
);