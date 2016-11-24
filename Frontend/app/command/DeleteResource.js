/**
 * Удаляет ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.DeleteResource',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				resourceManager = bridge.FBEditor.resource.Manager,
				resourceName = data.nameResource,
				result = false;

			try
			{
				if (resourceManager.isLoadUrl())
				{
					resourceManager.deleteFromUrl(resourceName);
					result = true;
				}
				else 
				{
					result = resourceManager.deleteResource(resourceName);
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
						message: 'Невозможно удалить ресурс ' + (e ? '(' + e + ')' : ''),
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			// восстанавливает удаленный ресурс
		}
	}
);