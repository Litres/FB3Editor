/**
 * Контроллер окна с результатами поиска тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tag.TagController',
	{
		extend: 'FBEditor.view.form.desc.searchField.WindowController',

		alias: 'controller.form.desc.subject.tag',

		/**
		 * @inheritdoc
		 * @event selectTag
		 */
		onSelect: function (data)
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				subject = win.getSubject(),
				val;

			val = data[view.displayField];

			// вырезаем теги жирности
			val = val.replace(/<\/?b>/ig, '');

			subject.fireEvent('selectTag', val);
		},

		/**
		 * Выполняет запрос и загрузку данных.
		 * @event loadData
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

		onAlignTo: function ()
		{
			//
		}
	}
);