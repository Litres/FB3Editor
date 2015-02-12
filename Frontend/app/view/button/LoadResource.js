/**
 * Кнопка загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.LoadResource',
	{
		extend: 'Ext.form.field.FileButton',
		requires: [
			'FBEditor.command.LoadResource'
		],
		id: 'button-load-resource',
		xtype: 'button-load-resource',
		text: 'Загрузить ресурс',
		listeners: {
			change: function (btn, evt)
			{
				var cmd;

				cmd = Ext.create('FBEditor.command.LoadResource', {evt: evt});
				if (cmd.execute())
				{
					FBEditor.HistoryCommand.add(cmd);
				}
			}
		}
	}
);