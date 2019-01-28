/**
 * Контроллер панели поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.SearchController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.search',
		
		/**
		 * Вызывается при изменении данных поиска.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				count,
				data,
				editorPanel,
				manager;
			
			// получаем данные поиска
			data = view.getDataForSearch();
			
			editorPanel = view.getEditorPanel();
			manager = editorPanel.getManager();
			
			// выполняем поиск и получаем количество найденных совпадений
			count = manager.search(data);
			
			// отображаем количество найденных результатов
			view.setCount(count);
			
			// синхронизируем кнопки с полем поиска
			view.syncButtons(count);
		},
		
		/**
		 * Перемещает курсор к следующему найденому результату.
		 */
		onFindNext: function ()
		{
			var me = this,
				view = me.getView(),
				editorPanel,
				manager;
			
			editorPanel = view.getEditorPanel();
			manager = editorPanel.getManager();
			manager.findNext();
		},
		
		/**
		 * Перемещает курсор к предыдущему найденому результату.
		 */
		onFindPrev: function ()
		{
			var me = this,
				view = me.getView(),
				editorPanel,
				manager;
			
			editorPanel = view.getEditorPanel();
			manager = editorPanel.getManager();
			manager.findPrev();
		},
		
		/**
		 * Деактивирует кнопки.
		 */
		onDisableButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtonsSync();
			
			Ext.each(
				buttons,
				function (btn)
				{
					btn.disable();
				}
			)
		},
		
		/**
		 * Активирует кнопки.
		 */
		onEnableButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtonsSync();
			
			Ext.each(
				buttons,
				function (btn)
				{
					btn.enable();
				}
			)
		}
	}
);