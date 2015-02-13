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
				result = false;

			Ext.Msg.prompt(
				'Новая папка',
				'Имя:',
				function(btn, name)
				{
					if (btn === 'ok' && !Ext.isEmpty(name))
					{
						result = bridge.FBEditor.resource.Manager.createFolder(name);
					}
				}
			);

			return result;
		},

		unExecute: function ()
		{
			// удаляет созданную папку
		}
	}
);