/**
 * Контроллер панели отображения данных произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.arts.ArtsController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.arts',

		/**
		 * Загружает данные в панель.
		 * @param {Object} data Данные для запроса.
		 */
		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				store = view.store;

			if (data)
			{
				view.setLoading(view.loadMask);
				store.setParams(data);
				store.load();
			}
		}
	}
);