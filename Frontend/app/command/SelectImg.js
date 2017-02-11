/**
 * Выбирает изображение.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SelectImg',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				result = false,
				manager = FBEditor.resource.Manager,
				scope,
				win;

			// функция-колбэк для выбора ресурса
			function selectFn (data)
			{
				var res,
					manager = FBEditor.resource.Manager;

				win.close();
				res = manager.getResource(data.fileId);

				// отправляем данные в необходимый компонент
				scope.updateData({url: res.url, name: res.name});

				manager.setSelectFunction(null);
			}

			scope = data.scope;
			win = data.win;

			if (win.show)
			{
				result = true;
				win.show();
				manager.setSelectFunction(selectFn);
			}

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый ресурс
			return true;
		}
	}
);