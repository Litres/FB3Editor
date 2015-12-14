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
				title = view.getTitle();
				title.autoValue();
				title = view.getTitle();
				names = title.getNames();
				me.searchName(names);
			}
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
				resultContainer;

			if (names.last.length > 1 || names.first.length > 1 || names.middle.length > 1)
			{
				resultContainer = view.getResultContainer();
				resultContainer.fireEvent('loadData', names);

				// сохраняем имена в локальном хранилище
				resultContainer.setStorageNames(names);
			}
		}
	}
);