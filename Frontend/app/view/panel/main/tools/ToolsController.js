/**
 * Контроллер панели инструментов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.tools.ToolsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.main.tools',

		onResize: function ()
		{
			var me = this,
				view = me.getView(),
				components;
			
			components = [
				view.down('panel-filename'),
				view.down('component-logo-litres')
			];
			
			Ext.each(
				components,
				function (item)
				{
					item.fireEvent('checkPosition');
				}
			);
		}
    }
);