/**
 * Загружает описание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.LoadDesc',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				result = false,
				manager = FBEditor.desc.Manager,
				url;

			url = manager.loadUrl;

			try
			{
				if (url)
				{
					manager.loadFromUrl(url);
					result = true;
				}
			}
			catch (e)
			{
				//
			}

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);