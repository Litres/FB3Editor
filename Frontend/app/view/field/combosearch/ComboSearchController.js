/**
 * Контроллер поля поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.combosearch.ComboSearchController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.combosearch',

		/**
		 * @template
		 * Обновляет данные полей.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			// необходима реализация метода в конкретном классе
			throw Error('Необходимо реализовать метод view.field.combosearch.ComboSearchController#updateData()');
		},

		/**
		 * Вызывается при выборе записи из списка.
		 */
		onSelect: function (combo, record)
		{
			var me = this,
				view = me.getView(),
				data;

			data = record[0].data;
			//console.log('select', data);

			me.updateData(data);

			// сохраняем выбранную запись
			view.saveToStorage(data);
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
				// при пустом поле показываем список, сохраненный локально
				combo.expandStorage();
			}
		}
	}
);