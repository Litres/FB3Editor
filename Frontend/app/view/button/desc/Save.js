/**
 * Кнопка сохранения описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.desc.Save',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.SaveDesc'
		],
		id: 'button-desc-save',
		xtype: 'button-desc-save',
		text: 'Сохранить',

		handler: function ()
		{
			var cmd,
				data = {},
				bridge = FBEditor.getBridgeWindow();

			cmd = bridge.Ext.create('FBEditor.command.SaveDesc', data);
			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);