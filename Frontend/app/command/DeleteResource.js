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
				result = false;

			try
			{
				result = bridge.FBEditor.resource.Manager.deleteResource(data.nameResource);
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