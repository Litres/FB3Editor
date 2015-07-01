/**
 * Кнопка удаления элемента из текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.editor.DeleteElement',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.editor.command.DeleteCommand'
		],
		id: 'button-editor-delete-element',
		xtype: 'button-editor-delete-element',
		text: 'Удалить',

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Ссылка на элемент.
		 */
		element: null,

		handler: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				cmd,
				data = {};

			data.el = me.element;
			cmd = bridge.Ext.create('FBEditor.editor.command.DeleteCommand', data);
			if (cmd.execute())
			{
				bridge.FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);