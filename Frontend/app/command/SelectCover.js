/**
 * Выбирает обложку.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SelectCover',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				result;

			//result = bridge.FBEditor.file.Manager.openResource(data.evt);
			console.log('Обложка');

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
		}
	}
);