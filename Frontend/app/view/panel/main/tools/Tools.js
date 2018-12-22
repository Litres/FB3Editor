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
			'FBEditor.view.component.logo.Litres',
			'FBEditor.view.panel.filename.FileName',
			'FBEditor.view.panel.main.tools.ToolsController',
			'FBEditor.view.panel.main.tools.ToolsTab'
		],
		
		id: 'panel-main-tools',
		xtype: 'panel-main-tools',
		controller: 'panel.main.tools',
		
		cls: 'panel-main-tools',
		
		listeners: {
			resize: 'onResize'
		},
		
		panelName: 'tools',
		region: 'north',
		stateful: false,
		split: false,
		bodyPadding: '10px 0 0 0',
		
		items: [
			{
				xtype: 'panel-main-toolstab'
			},
			{
				xtype: 'component-logo-litres'
			},
			{
				xtype: 'panel-filename'
			}
		]
    }
);