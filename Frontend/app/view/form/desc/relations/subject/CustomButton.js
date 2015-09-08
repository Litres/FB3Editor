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
				manager = FBEditor.desc.Manager;

			// получаем новый id
			manager.getNewId(
				{
					url: 'https://hub.litres.ru/pages/machax_persons/',
					property: 'persons',
					fn: me.setSubjectId,
					scope: me
				}
			);

			me.switchContainers();
		},

		/**
		 * Переключает контейнер с поиска на данные или обратно.
		 * @param {Boolean} customToSearch Переключить ли контейнер на поиск.
		 */
		switchContainers: function (customToSearch)
		{
			var me = this,
				hidden,
				search,
				custom;

			search = me.searchContainer;
			custom = me.customContainer;

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
				container;

			// обновляем поле id
			container = me.up('[name=plugin-fieldcontainerreplicator]');
			container.updateData({'relations-subject-id': id});
		}
	}
);