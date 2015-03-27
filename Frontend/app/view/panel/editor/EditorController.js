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
				viewports = me.getViewports();

			Ext.Array.each(
				viewports,
			    function (item)
			    {
				    item.loadData(data);
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