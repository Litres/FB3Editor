/**
 * Загружает ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.LoadResource',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				result;

			result = bridge.FBEditor.file.Manager.openResource(data.evt);

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
		}
	}
);