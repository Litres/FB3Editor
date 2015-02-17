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
						try
						{
							result = bridge.FBEditor.resource.Manager.createFolder(name);
						}
						catch (e)
						{
							Ext.log(
								{
									level: 'error',
									msg: e,
									dump: e
								}
							);
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно создать папку ' + (e ? '(' + e + ')' : ''),
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
						}
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