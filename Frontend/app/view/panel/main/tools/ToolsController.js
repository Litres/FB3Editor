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
				filename;

			filename = view.down('panel-filename');
			filename.fireEvent('checkPosition');
		}
    }
);