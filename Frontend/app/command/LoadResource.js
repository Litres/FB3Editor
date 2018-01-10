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
				fileManager = bridge.FBEditor.file.Manager,
				result;

			result = fileManager.openResource(data.evt).then(
				function (res)
				{
                    try
                    {
                        FBEditor.resource.Manager.loadResource(res);
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
                                message: 'Невозможно заугрузить ресурс ' + (e ? '(' + e + ')' : ''),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            }
                        );
                    }
				}
			);

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
		}
	}
);