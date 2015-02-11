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
				descValues,
				descXml,
				fb3data,
				result;

			// предусмотрено на будущее
			//btn.disable();

			try
			{
				if (!desc.isValid())
				{
					throw Error('Некорректно заполнено описание книги');
				}
				descValues = desc.getValues();
				descXml = desc.getXml(descValues);
				fb3data = {
					meta: desc.getMetaXml(descValues),
					books: [
						{
							desc: descXml,
							bodies: [
								{
									content: content.getXml(),
									images: FBEditor.resource.Manager.getData()
								}
							]
						}
					]
				};
				result = FBEditor.file.Manager.saveFB3(
					fb3data,
				    function ()
				    {
					    // предусмотрено на будущее
					    Ext.log(
						    {
							    level: 'warn',
							    msg: 'Стали доступны методы FileSaver.onwriteend, FileSaver.onabort'
						    }
					    );
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
						title: 'Ошибка сохранения',
						message: e.message ? e.message : 'Невозможно сохранить книгу',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
				result = false;
			}

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);