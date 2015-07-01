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
				scope,
				win,
				result = false;

			// функция-колбэк для выбора ресурса
			function selectFn (data)
			{
				var res,
					resourceManager = FBEditor.resource.Manager;

				win.close();
				res = resourceManager.getResourceByName(data.name);

				// отправляем данные в необходимый компонент
				scope.updateData({url: res.url, name: res.name});

				resourceManager.setSelectFunction(null);
			}

			scope = data.scope;
			win = data.win;
			if (win.show)
			{
				result = true;
				win.show();
				FBEditor.resource.Manager.setSelectFunction(selectFn);
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