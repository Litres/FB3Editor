/**
 * Контроллер поискового поля серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.name.NameController',
	{
		extend: 'FBEditor.view.form.desc.searchField.SearchFieldController',
		alias: 'controller.form.desc.sequence.search.name',

		onSelect: function (data)
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				plugin,
				btnAdd,
				searchField;

			// автоматически добавляем новый блок поиска
			plugin = me.getPlugin();
			btnAdd = plugin.getBtnAdd();
			plugin.addFields(btnAdd);

			// устанавливаем курсор в следующее поисковое поле
			searchField = view.getNextSearch();
			searchField.focus();

			// вырезаем теги жирности из названия
			Ext.Object.each(
				data,
				function (key, val)
				{
					data[key] = Ext.isString(val) ? val.replace(/<[/]?b>/ig, '') : val;
				}
			);

			// обновляем поля
			view.updateData(data);

			// закрываем окно
			win.close();

			// сохраняем выбранную запись
			view.saveToStorage(data);
		}
	}
);