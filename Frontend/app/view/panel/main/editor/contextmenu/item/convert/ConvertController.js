/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.convert.ConvertController',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.main.editor.item.convert',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				bridge = FBEditor.getBridgeWindow(),
				el = view.getElement(),
				data = {},
				history,
				cmd;
			
			data.el = el;
			cmd = bridge.Ext.create('FBEditor.editor.command.ConvertToTextCommand', data);
			
			if (cmd.execute())
			{
				history = el.getHistory();
				history.add(cmd);
			}
		}
	}
);