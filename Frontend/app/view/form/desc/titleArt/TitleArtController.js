/**
 * Контроллер текстового поля для названия произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.titleArt.TitleArtController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.titleArt',

		/**
		 * Вызывается при изменении названия.
		 */
		onChangeTitle: function ()
		{
			var me = this,
				view = me.getView(),
				loading = FBEditor.desc.Manager.loadingProcess,
				name = view.getMain().getValue();

			// игнорируем поиск при автоматическом заполнении полей описания (загрузка из книги или по ссылке)
			if (!loading)
			{
				me.abortSearch();
				me.onCleanResultContainer();
				me.searchName(name);
			}
		},

		/**
		 * Вызывается при установке фокуса.
		 */
		onFocusTitle: function ()
		{
			var me = this,
				view = me.getView(),
				personsContainer;

			personsContainer = view.getPersonsContainer();
			personsContainer.clean();
		},

		/**
		 * Вызывается при потери фокуса.
		 */
		onBlurTitle: function ()
		{},

		/**
		 * Очищает контейнер результатов поиска и хранилище.
		 */
		onCleanResultContainer: function ()
		{
			var me = this,
				view = me.getView(),
				resultContainer = view.getResultContainer();

			resultContainer.clean();
			resultContainer.setStorageNames(null);
		},

		/**
		 * Ищет произведение по названию.
		 * @param {String} name Название.
		 */
		searchName: function (name)
		{
			var me = this,
				view = me.getView(),
				input = view.getMain(),
				plugin,
				resultContainer,
				params;

			if (name.length > 1)
			{
				// показываем индикатор загрузки
				plugin = input.getPlugin('searchField');
				plugin.showLoader();

				resultContainer = view.getResultContainer();
				params = {q: name};
				resultContainer.fireEvent('loadData', params);

				// сохраняем имена в локальном хранилище
				resultContainer.setStorageNames(params);
			}
		},

		/**
		 * Прерывает предыдущий поиск.
		 */
		abortSearch: function ()
		{
			var me = this,
				view = me.getView(),
				input = view.getMain(),
				plugin,
				resultContainer;

			resultContainer = view.getResultContainer();
			resultContainer.abort();

			// скрываем индикатор загрузки
			plugin = input.getPlugin('searchField');
			plugin.hideLoader();
		}
	}
);