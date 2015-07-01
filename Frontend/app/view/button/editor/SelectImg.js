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
		xtype: 'button-editor-select-img',
		text: 'Выбрать',

		/**
		 * @property {Ext.Component} Компонент, из которого вызывается окно выбора ресурса,
		 * и которому отправятся данные после выбора ресурса.
		 */
		scope: null,

		handler: function (btn)
		{
			var cmd,
				data = {},
				bridge = FBEditor.getBridgeWindow();

			data.win = bridge.FBEditor.resource.ExplorerManager.getWindow();
			data.scope = btn.scope;
			cmd = bridge.Ext.create('FBEditor.command.SelectImg', data);
			if (cmd.execute())
			{
				bridge.FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);