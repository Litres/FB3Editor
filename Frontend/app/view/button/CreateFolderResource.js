/**
 * Кнопка создания новой папки в редаткоре ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.CreateFolderResource',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.CreateFolderResource'
		],
		id: 'button-createfolder-resource',
		xtype: 'button-createfolder-resource',
		text: 'Создать папку',
		handler:  function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.CreateFolderResource');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);