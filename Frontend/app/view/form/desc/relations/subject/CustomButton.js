/**
 * Кнопка для переключения в ручной режим создания связанной персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.CustomButton',
	{
		extend: 'Ext.Button',
		xtype: 'form-desc-relations-subject-customBtn',
		text: 'Создать вручную',
		margin: '0 0 0 165px',

		/**
		 * @property {FBEditor.view.form.desc.relations.subject.SearchContainer}
		 */
		searchContainer: null,

		/**
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer}
		 */
		customContainer: null,

		handler: function ()
		{
			var me = this,
				manager = FBEditor.desc.Manager,
				searchContainer = me.searchContainer;

			// получаем новый id
			manager.getNewId(
				{
					url: 'https://hub.litres.ru/pages/machax_persons/',
					property: 'persons',
					fn: me.setSubjectId,
					scope: me
				}
			);

			// устанавливаем ФИО из поскового поля в поля ручного вввода
			me.setNamesFromSearchField();

			me.switchContainers();

			// удаляем контейнер поиска
			searchContainer.destroy();
		},

		/**
		 * Переключает контейнер с поиска на данные или обратно.
		 * @param {Boolean} customToSearch Переключить ли контейнер на поиск.
		 */
		switchContainers: function (customToSearch)
		{
			var me = this,
				search = me.searchContainer,
				custom = me.customContainer,
				hidden;

			hidden = customToSearch ? true : false;

			custom.setHidden(hidden);
			search.setHidden(!hidden);
		},

		/**
		 * Устанавливает id в поле.
		 * @param {String} id uuid.
		 */
		setSubjectId: function (id)
		{
			var me = this,
				custom = me.customContainer;

			// обновляем поле id
			custom.updateData({'relations-subject-id': id});
		},

		/**
		 * Устанавливает ФИО в поля ручного ввода, копируя значение из поля поиска.
		 */
		setNamesFromSearchField: function ()
		{
			var me = this,
				search = me.searchContainer,
				custom = me.customContainer,
				names,
				searchVal;

			// строка в поле поиска
			searchVal = search.down('[name=relations-subject-search]').getValue();

			// разбиваем строку на три значения, отделенных пробелами для получения ФИО
			searchVal = searchVal ? searchVal.trim() : '';
			names = searchVal.split(/[ ]+/, 3);

			// обновляем поля ФИО
			custom.updateData(
				{
					'relations-subject-last-name': names[0],
					'relations-subject-first-name': names[1] || '',
					'relations-subject-middle-name': names[2] || ''
				}
			);
		}
	}
);