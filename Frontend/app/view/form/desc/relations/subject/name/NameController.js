/**
 * Контроллер текстового поля для фамилии/имени/отчества.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.NameController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.name',

		onAfterRender: function ()
		{
			var me = this,
				view = me.getView(),
				resultContainer = view.getResultContainer(),
				personsContainer = resultContainer.getPanelPersons();

			// сбрасываем ФИО, сохраненные в локальном хранилище
			me.onCleanResultContainer();

			personsContainer.on(
				{
					scope: view,
					afterLoad: view.afterLoad
				}
			);
		},

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				loading = FBEditor.desc.Manager.loadingProcess,
				title,
				names;

			// игнорируем поиск при автоматическом заполнении полей описания (загрузка из книги или по ссылке)
			if (!loading)
			{
				me.abortSearch();
				me.onCleanResultContainer();
				title = view.getTitle();
				title.autoValue();
				title = view.getTitle();
				names = title.getNames();
				me.searchName(names);
			}
		},

		onFocus: function ()
		{
			var me = this,
				view = me.getView(),
				artsContainer;

			artsContainer = view.getArtsContainer();
			artsContainer.clean();
		},

		/**
		 * Очищает контейнер результатов поиска.
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
		 * Ищет персоны по ФИО.
		 * @param names ФИО.
		 * @param {String} names.last
		 * @param {String} names.first
		 * @param {String} names.middle
		 */
		searchName: function (names)
		{
			var me = this,
				view = me.getView(),
				plugin,
				resultContainer;

			if (names.last.length > 1 || names.first.length > 1 || names.middle.length > 1)
			{
				// показываем индикатор загрузки
				plugin = view.getPlugin('searchField');
				plugin.showLoader();

				resultContainer = view.getResultContainer();
				resultContainer.fireEvent('loadData', names);

				// сохраняем имена в локальном хранилище
				resultContainer.setStorageNames(names);
			}
		},

		/**
		 * Прерывает предыдущий поиск.
		 */
		abortSearch: function ()
		{
			var me = this,
				view = me.getView(),
				resultContainer,
				plugin;

			resultContainer = view.getResultContainer();
			resultContainer.abort();

			// скрываем индикатор загрузки
			plugin = view.getPlugin('searchField');
			plugin.hideLoader();
		}
	}
);