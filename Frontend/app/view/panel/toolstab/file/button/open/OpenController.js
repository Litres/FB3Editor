/**
 * Контроллер кнопки открытия файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.open.OpenController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.file.button.open',
		requires: [
			'FBEditor.command.OpenFile'
		],

		/**
		 * Открывает файл.
		 * @param {FBEditor.view.panel.toolstab.file.button.open.Open} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onChange: function (btn, evt)
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenFile', {evt: evt});
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);