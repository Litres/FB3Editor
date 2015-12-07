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
				plugin,
				btnAdd,
				comboSearch,
				data;

			data = record[0].data;
			//console.log('select', data);

			// автоматически добавляем новый блок поиска
			plugin = me.getPlugin();
			btnAdd = plugin.getBtnAdd();
			plugin.addFields(btnAdd);

			comboSearch = me.getNextComboSearch();

			if (comboSearch)
			{
				// устанавливаем курсор в следующее поисковое поле
				comboSearch.focus();
			}

			me.updateData(data);

			// сохраняем выбранную запись
			view.saveToStorage(data);
		},

		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				val;

			val = view.getValue();

			if (val)
			{
				// разворачиваем список, если значение не пустое
				view.expand();
			}
			else
			{
				// при пустом поле показываем список, сохраненный локально
				view.expandStorage();
			}
		},

		/**
		 * @private
		 * Возвращает плагин.
		 * @return {FBEditor.ux.FieldContainerReplicator}
		 */
		getPlugin: function ()
		{
			var me = this,
				view = me.getView(),
				plugin;

			plugin = view.up('[plugins]').getPlugin('fieldcontainerreplicator');

			return plugin;
		},

		/**
		 * @private
		 * Возвращает следующее поисковое поле.
		 * @return {FBEditor.view.field.combosearch.ComboSearch}
		 */
		getNextComboSearch: function ()
		{
			var me = this,
				view = me.getView(),
				comboSearch,
				next;

			next = view.up('[plugins]').nextSibling();
			comboSearch = next ? next.down('combosearch') : null;

			return comboSearch;
		}
	}
);