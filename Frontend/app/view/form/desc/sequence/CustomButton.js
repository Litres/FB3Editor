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

			me.switchContainers();
		},

		/**
		 * Переключает контейнер с поиска на данные.
		 */
		switchContainers: function ()
		{
			var me = this,
				search,
				custom;

			search = me.searchContainer;
			custom = me.customContainer;

			custom.setHidden(false);
			search.setHidden(true);
		},

		/**
		 * Устанавливает id в поле.
		 * @param {String} id uuid.
		 */
		setSequenceId: function (id)
		{
			var me = this,
				container;

			// обновляем поле id
			container = me.up('[name=plugin-fieldcontainerreplicator]');
			container.updateData({'sequence-id': id});
		}
	}
);