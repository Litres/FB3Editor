/**
 * Кнопка загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.SelectCover',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.SelectCover'
		],
		id: 'button-select-cover',
		xtype: 'button-select-cover',
		text: 'Выбрать',

		handler: function ()
		{
			var cmd,
				data = {},
				bridge = FBEditor.getBridgeWindow();

			data.win = bridge.FBEditor.resource.ExplorerManager.getWindow();
			cmd = bridge.Ext.create('FBEditor.command.SelectCover', data);
			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);