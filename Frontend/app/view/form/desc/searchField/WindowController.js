/**
 * Контроллер окна с результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.searchField.WindowController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.searchField.window',

		/**
		 * Вызывается при выборе записи из списка.
		 * @param {Object} data Данные записи.
		 */
		onSelect: function (data)
		{},

		/**
		 * Выполняет запрос и загрузку данных.
		 * @param {Object} params Параметры запроса.
		 */
		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				input = view.searchField,
				containerItems = view.getContainerItems(),
				plugin;

			// показываем индикатор загрузки
			plugin = input.getPlugin('searchField');
			plugin.showLoader();

			containerItems.maskSearching(false);
			containerItems.params = Ext.clone(params);
			containerItems.fireEvent('loadData', params);
		},

		/**
		 * Вызывается при клике на окне.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * Позиционирует окно относительно поля поиска.
		 */
		onAlignTo: function ()
		{
			var me = this,
				view = me.getView(),
				posY = view.searchField.getY(),
				height = view.getHeight(),
				bodyHeight = Ext.getBody().getHeight();

			if (view.isVisible() && view.searchField && view.rendered)
			{
				if (bodyHeight - posY < height)
				{
					view.alignTo(view.searchField, 'tl', [0, -height]);
				}
				else
				{
					view.alignTo(view.searchField, 'bl', [0, 0]);
				}
			}
		},

		/**
		 * Вызывается при изменении размеров окна.
		 */
		onResize: function ()
		{
			var me = this,
				view= me.getView();

			me.onAlignTo();

			// предотвращаем скрытие окна
			view.isShow = false;
		}
	}
);