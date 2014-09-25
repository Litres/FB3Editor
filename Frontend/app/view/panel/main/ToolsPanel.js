/**
 * Панель инструментов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.ToolsPanel',
	{
		extend: 'FBEditor.view.panel.main.AbstractPanel',
		xtype: 'panel-main-tools',
		height: 100,
		region: 'north',
		collapsible: true,
        title: 'Инструменты',
        html: 'Содержимое верхней панели'
    }
);