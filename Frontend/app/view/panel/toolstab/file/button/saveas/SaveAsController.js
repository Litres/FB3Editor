/**
 * Контроллер кнопки сохранения книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.saveas.SaveAsController',
	{
		extend: 'Ext.app.ViewController',
		requires: [
			'FBEditor.command.SaveAsFile'
		],

		alias: 'controller.panel.toolstab.file.button.saveas',

		/**
		 * Сохраняет книгу локально.
		 * @param {FBEditor.view.panel.toolstab.file.button.saveas.SaveAs} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (btn, evt)
		{
			var cmd,
				cmdOpts;

			cmdOpts = {
				btn: btn,
				desc: Ext.getCmp('form-desc')
			};
			
			cmd = Ext.create('FBEditor.command.SaveAsFile', cmdOpts);
			
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);