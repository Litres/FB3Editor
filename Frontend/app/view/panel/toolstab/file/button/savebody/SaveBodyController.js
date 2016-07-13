/**
 * Контроллер кнопки сохранения тела.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savebody.SaveBodyController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.file.button.savebody',
		requires: [
			'FBEditor.command.SaveBody'
		],

		/**
		 * Сохраняет тело на URL.
		 * @param {FBEditor.view.panel.toolstab.file.button.savebody.SaveBody} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (btn, evt)
		{
			var cmd,
				data = {},
				bridge = FBEditor.getBridgeWindow();

			cmd = bridge.Ext.create('FBEditor.command.SaveBody', data);
			
			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		},

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager();

			if (manager.isLoadUrl())
			{
				view.setHidden(false);
			}
		}
	}
);