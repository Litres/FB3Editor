/**
 * Контроллер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.EditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.view.editor',

		/**
		 * Загружает данные тела книги в окна редактора.
		 * @param {HTMLElement} data Тело книги.
		 */
		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				viewports = me.getViewports(),
				north;

			north = view.viewports.north;
			Ext.Array.each(
				viewports,
			    function (item)
			    {
				    item.loadData(data);
				    if (item.id !== north.id)
				    {
					    item.fireEvent('syncScroll', north);
				    }
			    }
			);
		},

		/**
		 * Разделяет окно редактирования.
		 */
		onSplit: function ()
		{
			var me = this,
				view = me.getView();

			view.addSouthViewport();
		},

		/**
		 * Снимает разделение окна редактирования.
		 */
		onUnsplit: function ()
		{
			var me = this,
				view = me.getView();

			view.removeSouthViewport();
		},

		/**
		 * Синхронизирует данные между окнами редактирования.
		 * @param viewport
		 */
		onSyncContent: function (viewport)
		{
			var me = this,
				view = me.getView(),
				viewports = me.getViewports();

			Ext.Array.each(
				viewports,
				function (item)
				{
					var data;

					if (item.id !== viewport.id)
					{
						data = viewport.getContent().getEl().dom.innerHTML;
						item.loadData(data);
					}
				}
			);
		},

		/**
		 * @private
		 * Возвращает окна редактирования текста.
		 * @return {FBEditor.view.panel.editor.viewport.Viewport[]} Окна редактирования текста.
		 */
		getViewports: function ()
		{
			var me = this,
				view = me.getView(),
				viewports = [];

			viewports.push(view.viewports.north);
			if (view.viewports.south)
			{
				viewports.push(view.viewports.south);
			}

			return viewports;
		}
	}
);