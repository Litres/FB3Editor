/**
 * Кнопка загрузки описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.desc.Load',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.LoadDesc'
		],
		id: 'button-desc-load',
		xtype: 'button-desc-load',
		text: 'Загрузить',

		handler: function ()
		{
			var cmd,
				data = {},
				bridge = FBEditor.getBridgeWindow();

			cmd = bridge.Ext.create('FBEditor.command.LoadDesc', data);
			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);