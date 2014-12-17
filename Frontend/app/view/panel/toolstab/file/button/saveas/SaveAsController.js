/**
 * Контроллер кнопки сохранения книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.saveas.SaveAsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.file.button.saveas',
		requires: [
			'FBEditor.command.SaveAsFile'
		],

		/**
		 * Сохраняет книгу локально.
		 * @param {FBEditor.view.panel.toolstab.file.button.saveas.SaveAs} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (btn, evt)
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.SaveAsFile', {evt: evt});
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);