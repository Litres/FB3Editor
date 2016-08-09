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
				btn,
				promise;

			if (!form.isValid())
			{
				Ext.log(
					{
						level: 'error',
						msg: 'Некорректно заполнено описание книги'
					}
				);

				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Некорректно заполнено описание книги',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);

				return false;
			}

			// кнопка сохранения
			btn = data.btn;
			btn.disable();

			promise = new Promise(
				function (resolve, reject)
				{
					// сохраняем описание на хабе
					manager.saveToUrl(resolve, reject);
				}
			);

			promise.then(
				function ()
				{
					btn.enable();
				},
				function ()
				{
					btn.enable();
				}
			);

			result = true;

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);