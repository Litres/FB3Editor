/**
 * Кнопка для переключения в ручной режим создания связанного объекта.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.CustomButton',
	{
		extend: 'Ext.Button',
		
		xtype: 'form-desc-relations-object-customBtn',
		
		text: 'Создать вручную',
		margin: '0 0 0 165px',

		/**
		 * @property {FBEditor.view.form.desc.relations.object.SearchContainer}
		 */
		searchContainer: null,

		/**
		 * @property {FBEditor.view.form.desc.relations.object.CustomContainer}
		 */
		customContainer: null,

		handler: function ()
		{
			var me = this,
				manager = FBEditor.desc.Manager;

			// получаем новый id
			manager.getNewId(
				{
					url: Ext.manifest.hubApiEndpoint + '/pages/machax_arts/',
					property: 'arts',
					fn: me.setObjectId,
					scope: me
				}
			);

			// устанавливаем название из поскового поля в поле ручного вввода
			me.setNameFromSearchField();

			me.switchContainers();
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
		setObjectId: function (id)
		{
			var me = this,
				custom = me.customContainer;

			// обновляем поле ссылки id
			custom.updateData({'relations-object-id': id});

			// делаем ссылку неактивной
			custom.down('[name=relations-object-id]').disableLink();
		},

		/**
		 * Устанавливает название в поле ручного ввода, копируя значение из поля поиска.
		 */
		setNameFromSearchField: function ()
		{
			var me = this,
				search = me.searchContainer,
				custom = me.customContainer,
				searchVal;

			// строка в поле поиска
			searchVal = search.down('[name=relations-object-search]').getValue();
			searchVal = searchVal ? searchVal.trim() : '';

			// обновляем поле названия
			custom.updateData(
				{
					'relations-object-title-main': searchVal
				}
			);
		}
	}
);