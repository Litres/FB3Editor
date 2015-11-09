/**
 * Контроллер кнопки сохранения описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDescController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.file.button.savedesc',
		requires: [
			'FBEditor.command.SaveDesc'
		],

		/**
		 * Сохраняет описание на URL.
		 * @param {FBEditor.view.panel.toolstab.file.button.savedesc.SaveDesc} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (btn, evt)
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