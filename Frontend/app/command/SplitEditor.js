/**
 * Разделяет окно редактирования тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SplitEditor',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				btn = data.btn,
				editor = data.editor,
				result = false;

			editor.fireEvent('split');
			result = true;

			return result;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.data,
				btn = data.btn,
				editor = data.editor,
				result = false;

			editor.fireEvent('unsplit');
			result = true;

			return result;
		}
	}
);