/**
 * Контроллер кнопки сохранения описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDescController',
	{
		extend: 'Ext.app.ViewController',
		requires: [
			'FBEditor.command.SaveDesc'
		],

		alias: 'controller.panel.toolstab.file.button.savedesc',

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

			data.btn = btn;
			cmd = bridge.Ext.create('FBEditor.command.SaveDesc', data);

			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		},

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				descManager = FBEditor.desc.Manager;

			if (descManager.isLoadUrl())
			{
				view.setActive(true);
			}
		}
	}
);