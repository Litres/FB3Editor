/**
 * Кнопка выбора ресурса для изображения в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.editor.SelectImg',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.SelectImg'
		],
		id: 'button-editor-select-img',
		xtype: 'button-editor-select-img',
		text: 'Выбрать',

		handler: function ()
		{
			var cmd,
				data = {};

			data.win = FBEditor.resource.ExplorerManager.getWindow();
			cmd = Ext.create('FBEditor.command.SelectImg', data);
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);