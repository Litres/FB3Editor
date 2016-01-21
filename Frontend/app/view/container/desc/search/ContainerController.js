/**
 * Контроллер контейнера с результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.ContainerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.container.desc.search',

		/**
		 * Делает запрос и загружает данные в контейнер.
		 * @param {Object} params Параметры для запроса.
		 */
		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				store = view.store;

			if (params)
			{
				view.maskSearching(true);
				store.setParams(params);
				store.load();
			}
		}
	}
);