/**
 * Сохраняет описание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SaveDesc',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				result = false,
				manager = FBEditor.desc.Manager,
				form = Ext.getCmp('form-desc'),
				url;

			url = manager.saveUrl;

			try
			{
				if (url)
				{
					if (!form.isValid())
					{
						throw Error('Некорректно заполнено описание книги');
					}

					manager.saveToUrl(url);
					result = true;
				}
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: 'Ошибка сохранения описания книги', dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: e,
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