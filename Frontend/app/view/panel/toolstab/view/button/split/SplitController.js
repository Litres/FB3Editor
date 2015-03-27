/**
 * Контроллер кнопки резделения окна редактирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.view.button.split.SplitController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.view.button.split',
		requires: [
			'FBEditor.command.SplitEditor',
			'FBEditor.command.UnsplitEditor'
		],

		/**
		 * Выполняет  команду разделения или снятия рздаеления окна редактирования.
		 * @param {FBEditor.view.panel.toolstab.view.button.split.Split} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (btn, evt)
		{
			var cmd,
				cmdOpts,
				cmdName,
				isSplited;

			cmdOpts = {
				btn: btn,
				editor: Ext.getCmp('main-editor')
			};
			isSplited = btn.isSplited();
			cmdName = !isSplited ? 'FBEditor.command.SplitEditor' : 'FBEditor.command.UnsplitEditor';
			cmd = Ext.create(cmdName, cmdOpts);
			if (cmd.execute())
			{
				btn.setSplited(!isSplited);
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);