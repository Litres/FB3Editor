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
				win,
				result = false;

			win = data.win;
			if (win.show)
			{
				result = win.show() ? true : false;
			}

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
		}
	}
);