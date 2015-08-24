/**
 * Контроллер поля фамилии персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.last.LastController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.name.last',

		/**
		 * Вызывается при выборе персоны из списка.
		 */
		onSelect: function (combo, record)
		{
			var me = this,
				data;

			data = record[0].data;
			//console.log('select', data);

			me.updateData(data);
			me.saveData(data);
		},

		/**
		 * Вызывается при установке фокуса в поле.
		 */
		onFocus: function (combo)
		{
			var me = this,
				val;

			val = combo.getValue();

			//console.log('focus', combo);
			if (val)
			{
				// разворачиваем список, если значение не пустое
				combo.expand();
			}
			else
			{
				// при пустом поле показываем список персон, сохраненный локально
				combo.expandStorage();
			}
		},

		/**
		 * Обновляет данные полей.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			var me = this,
				view = me.getView(),
				d,
				container;

			container = view.up('[name=plugin-fieldcontainerreplicator]');
			d = {
				'relations-subject-id': data.uuid,
				'relations-subject-first-name': data['first_name'] ? data['first_name'] : '',
				'relations-subject-middle-name': data['middle_name'] ? data['middle_name'] : '',
				'relations-subject-title-main': data['title'] ? data['title'] : ''
			};
			container.updateData(d);
		},

		/**
		 * Сохраняет данные персоны в localStorage.
		 * @param {Object} data Данные.
		 */
		saveData: function (data)
		{
			var me = this,
				view = me.getView(),
				d;

			/*d = {
				'relations-subject-id': data.uuid,
				'relations-subject-first-name': data['first_name'] ? data['first_name'] : '',
				'relations-subject-middle-name': data['middle_name'] ? data['middle_name'] : '',
				'relations-subject-title-main': data['title'] ? data['title'] : ''
			};*/

			view.saveToStorage(data);
		}
	}
);