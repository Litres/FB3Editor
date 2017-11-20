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
				bridge = me.getBridgeWindow(),
				manager = bridge.FBEditor.desc.Manager,
				content,
				url;

			url = manager.loadUrl;

			try
			{
				if (url)
				{
                    content = bridge.Ext.getCmp('panel-main-content');

                    manager.loadFromUrl().then(
                        function ()
                        {
                            content.fireEvent('contentDesc');
                        }
                    );

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