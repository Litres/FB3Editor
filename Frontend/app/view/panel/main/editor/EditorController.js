/**
 * Контроллер панели редактора текста книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.EditorController',
	{
		extend: 'FBEditor.editor.view.EditorController',
		alias: 'controller.view.main.editor',

		onLoadData: function ()
		{
			var me = this,
				view = me.getView(),
				viewports = view.getViewports(),
				content = view.getPanelContent(),
				manager = view.getManager(),
				data,
				north;

			// основное окно
			north = view.viewports.north;

			Ext.Array.each(
				viewports,
				function (item)
				{
					if (item.rendered)
					{
						// получаем html тела книги
						data = manager.getNode(item.id);

						// загружаем в окно
						item.loadData(data);

						if (item.id !== north.id && content.isActiveItem('main-editor'))
						{
							// синхронизируем скролл между окнами
							item.fireEvent('syncScroll', north);
						}
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
				view = me.getView(),
				viewports = view.getViewports(),
				manager = view.getManager(),
				data;

			Ext.Array.each(
				viewports,
				function (item)
				{
					if (item.id !== viewport.id)
					{
						// получаем html данные из исходного окна
						data = manager.getNode(item.id);

						// загружаем данные в окно
						item.loadData(data);
					}
				}
			);
		},
		
		/**
		 * Вызывается когда фокус покидает редактор тела книги.
		 */
		onFocusLeave: function ()
		{
			var me = this,
				view = me.getView();
			
			// сохраняем выделение в тексте
			view.saveEditorRange();
		}
	}
);