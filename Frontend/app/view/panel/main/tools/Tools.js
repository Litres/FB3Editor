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
			'FBEditor.view.panel.main.tools.ToolsModel'
		],
		id: 'panel-main-tools',
		xtype: 'panel-main-tools',
		controller: 'panel.main.tools',
		viewModel: {
			type: 'panel.main.tools'
		},
		panelName: 'tools',
		height: 100,
		region: 'north',
		collapsible: true,
        title: 'Инструменты',
        html: 'Содержимое верхней панели'
    }
);