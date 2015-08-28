/**
 * Контроллер поискового поля по uuid/id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.id.IdController',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearchController',
		alias: 'controller.form.desc.relations.subject.search.id',

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
				'relations-subject-id': data.uuid,
				'relations-subject-last-name': data['last_name'] ? data['last_name'] : '',
				'relations-subject-first-name': data['first_name'] ? data['first_name'] : '',
				'relations-subject-middle-name': data['middle_name'] ? data['middle_name'] : '',
				'relations-subject-title-main': data['title'] ? data['title'] : ''
			};
			container.updateData(d);

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = view.up('desc-fieldcontainer').down('form-desc-relations-subject-customBtn');
			btn.switchContainers();
		}
	}
);