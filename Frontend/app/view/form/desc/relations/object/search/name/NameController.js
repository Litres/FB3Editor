/**
 * Контроллер поискового поля по названию объекта.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.search.name.NameController',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearchController',
		alias: 'controller.form.desc.relations.object.search.name',

		/**
		 * Заполняет данные полей.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			var me = this,
				view = me.getView(),
				descManager = FBEditor.desc.Manager,
				btn,
				d,
				container;

			container = view.up('[name=plugin-fieldcontainerreplicator]');
			d = {
				'relations-object-id': data.uuid,
				'relations-object-title-main': data['name'] ? data['name'] : ''
			};

			// заполняем фому ручного ввода
			descManager.loadingProcess = true;
			container.updateData(d);
			descManager.loadingProcess = false;

			// ссылка на страницу редактирования
			container.down('[name=relations-object-page-link]').setData({uuid: data.uuid});

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = view.up('desc-fieldcontainer').down('form-desc-relations-object-customBtn');
			btn.switchContainers();
		}
	}
);