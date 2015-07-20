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
			'FBEditor.editor.command.ConvertToTextCommand'
		],
		id: 'button-editor-convert-element',
		xtype: 'button-editor-convert-element',
		text: 'Превратить в текст',

		handler: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				cmd,
				data = {};

			//TODO
			alert('В разработке!'); return false;
			data.el = me.element;
			cmd = bridge.Ext.create('FBEditor.editor.command.ConvertToTextCommand', data);
			if (cmd.execute())
			{
				bridge.FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);