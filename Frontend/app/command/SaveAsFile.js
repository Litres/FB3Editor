/**
 * Сохраняет книгу локально.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SaveAsFile',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				btn = me.data.btn,
				content = me.data.content,
				desc = me.data.desc,
				fb3data,
				result;

			//btn.disable();
			try
			{
				fb3data = {
					books: [
						{
							desc: desc.getXml(),
							bodies: [
								{
									content: content.getXml(),
									images: []
								}
							]
						}
					]
				};
				result = FBEditor.file.Manager.saveFB3(
					fb3data,
				    function ()
				    {
					    btn.enable();
				    }
				);
			}
			catch (e)
			{
				btn.enable();
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
						message: e.message ? e.message : 'Невозможно сохранить книгу',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);