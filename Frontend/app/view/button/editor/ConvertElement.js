/**
 * Кнопка превращения блочного элемента текста в стилевой.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.editor.ConvertElement',
	{
		extend: 'Ext.button.Button',
		requires: [

		],
		id: 'button-editor-convert-element',
		xtype: 'button-editor-convert-element',
		text: 'Превратить в текст',

		handler: function ()
		{
			var cmd,
				data = {};

			alert('В разработке!');return;
			cmd = Ext.create('FBEditor.command.ConvertElement', data);
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);