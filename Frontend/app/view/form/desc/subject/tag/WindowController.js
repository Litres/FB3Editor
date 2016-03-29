/**
 * Контроллер окна с результатами поиска тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tag.WindowController',
	{
		extend: 'FBEditor.view.form.desc.searchField.WindowController',
		alias: 'controller.form.desc.tag',

		onSelect: function (data)
		{
			var me = this,
				view = me.getView(),
				subject = view.subjectField;

			subject.fireEvent('selectTag', data);
		},

		/**
		 * Выполняет запрос и загрузку данных.
		 * @param {Object} params Параметры запроса.
		 */
		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				containerItems = view.getContainerItems();

			containerItems.maskSearching(false);
			containerItems.params = Ext.clone(params);
			containerItems.fireEvent('loadData', params);
		},

		/**
		 * Позиционирует окно относительно поля ввода.
		 */
		onAlignTo: function ()
		{
			var me = this,
				view = me.getView(),
				subject = view.subjectField;

			if (view.isVisible() && subject && view.rendered)
			{
				// выравниваем окно снизу от поля
				view.alignTo(view.getTextField(), 'bl', [115, 0]);
			}
		}
	}
);