/**
 * Кнопка для переключения в ручной режим создания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.CustomButton',
	{
		extend: 'Ext.Button',
		xtype: 'form-desc-sequence-customBtn',
		text: 'Создать вручную',
		margin: '0 0 0 165px',

		/**
		 * @property {FBEditor.view.form.desc.sequence.SearchContainer}
		 */
		searchContainer: null,

		/**
		 * @property {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		customContainer: null,

		handler: function ()
		{
			var me = this,
				manager = FBEditor.desc.Manager;

			// получаем новый id
			manager.getNewId(
				{
					url: 'https://hub.litres.ru/pages/machax_sequences/',
					property: 'series',
					fn: me.setSequenceId,
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
		setSequenceId: function (id)
		{
			var me = this,
				data = {},
				custom = me.customContainer;

			data['sequence-id'] = id;

			// обновляем ссылку id
			custom.updateData(data);

			// делаем ссылку неактивной
			custom.down('[name=sequence-id]').disableLink();
		},

		/**
		 * Устанавливает название в поле ручного ввода, копируя значение из поля поиска.
		 */
		setNameFromSearchField: function ()
		{
			var me = this,
				data = {},
				search = me.searchContainer,
				custom = me.customContainer,
				searchVal;

			// строка в поле поиска
			searchVal = search.down('[name=sequence-search]').getValue();
			searchVal = searchVal ? searchVal.trim() : '';

			data['sequence-title-main'] = searchVal;

			// обновляем поле названия
			custom.updateData(data);
		}
	}
);