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
		 */
		onLoadData: function ()
		{
			var me = this,
				view = me.getView(),
				viewports = me.getViewports(),
				content = Ext.getCmp('panel-main-content'),
				data,
				north;

			north = view.viewports.north;
			Ext.Array.each(
				viewports,
			    function (item)
			    {
				    data = FBEditor.editor.Manager.getNode(item.id);
				    item.loadData(data);
				    if (item.id !== north.id && content.isActiveItem('main-editor'))
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
		 * @param {FBEditor.view.panel.editor.viewport.Viewport} viewport Исходное окно редактирования,
		 * с которым необходимо синхронизировать остальные окна.
		 */
		onSyncContent: function (viewport)
		{
			var me = this,
				viewports = me.getViewports(),
				data;

			Ext.Array.each(
				viewports,
				function (item)
				{
					if (item.id !== viewport.id)
					{
						data = FBEditor.editor.Manager.getNode(item.id);
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