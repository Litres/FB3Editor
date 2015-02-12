/**
 * Создает новую папку в редакторе ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.CreateFolderResource',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				result;

			result = false;

			return result;
		},

		unExecute: function ()
		{
			// удаляет созданную папку
		}
	}
);