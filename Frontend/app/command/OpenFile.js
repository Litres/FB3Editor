/**
 * Открывает файл.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.OpenFile',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data,
				result;

			data = me.data;
			result = FBEditor.file.Manager.openFB3(data.evt);

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый файл
		}
	}
);