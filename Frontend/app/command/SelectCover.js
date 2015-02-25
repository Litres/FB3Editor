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
				data = me.data,
				bridge = FBEditor.getBridgeWindow(),
				win,
				fn,
				result = false;

			win = data.win;
			if (win.show)
			{
				result = true;
				win.show();
				bridge.FBEditor.resource.Manager.setSelectCoverFunction();
			}

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
		}
	}
);