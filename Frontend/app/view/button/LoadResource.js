/**
 * Кнопка загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.LoadResource',
	{
		extend: 'Ext.form.field.FileButton',
		id: 'button-load-resource',
		xtype: 'button-load-resource',
		text: 'Загрузить ресурс',
		width: '100%',
		listeners: {
			change: function (btn, evt)
			{
				var cmd;

				console.log(evt);
				/*cmd = Ext.create('FBEditor.command.OpenFile', {evt: evt});
				if (cmd.execute())
				{
					FBEditor.HistoryCommand.add(cmd);
				}*/
			}
		}
	}
);