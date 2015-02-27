/**
 * Перемещает ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.MoveResource',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				nameResource = data.nameResource,
				win,
				result = false;

			try
			{
				win = bridge.FBEditor.resource.TreeManager.getWindow();
				if (win.show)
				{
					result = true;
					win.setNameResource(nameResource);
					win.show();
					bridge.FBEditor.resource.Manager.setSelectFolderFunction();
				}
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
						message: 'Невозможно переместить ресурс ' + (e ? '(' + e + ')' : ''),
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			// отменяет перемещение ресурса
		}
	}
);