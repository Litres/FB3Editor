/**
 * Контроллер поискового поля по названию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.name.NameController',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearchController',
		alias: 'controller.form.desc.sequence.search.name',

		/**
		 * Заполняет данные полей.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			var me = this,
				view = me.getView(),
				btn,
				d,
				container;

			container = view.up('[name=plugin-fieldcontainerreplicator]');
			d = {
				'sequence-id': data.uuid,
				'sequence-title-main': data['name'] ? data['name'] : ''
			};
			container.updateData(d);

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = view.up('desc-fieldcontainer').down('form-desc-sequence-customBtn');
			btn.switchContainers();
		}
	}
);