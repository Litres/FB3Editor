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
			var cmd;

			cmd = Ext.create('FBEditor.command.SelectCover');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);