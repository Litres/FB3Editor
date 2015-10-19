/**
 * Контроллер текстового поля для фамилии/имени/отчества..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.NameController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.name',

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				loading = FBEditor.desc.Manager.loadingProcess,
				title,
				name;

			// игнорируем поиск при автоматическом заполнении полей описания (загрузка из книги или по ссылке)
			if (!loading)
			{
				title = view.getTitle();
				title.autoValue();
				title = view.getTitle();
				name = title.getNames();

				if (name.length > 1)
				{
					// делаем поиск от 2 символов
					me.searchName(name);
				}
			}
		},

		/**
		 * Ищет персоны по ФИО.
		 * @param {String} name ФИО.
		 */
		searchName: function (name)
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.webworker.Manager,
				params,
				values,
				url,
				master;

			// разбиваем строку на три значения, отделенных пробелами
			values = name.split(/[ ]+/, 3);

			// формируем параметры для запроса
			params = {
				last: values[0],
				first: values[1] ? values[1] : '',
				middle: values[2] ? values[2] : ''
			};

			url = 'https://hub.litres.ru/pages/machax_persons/?';
			url += 'last=' + params.last;
			url += '&first=' + params.first;
			url += '&middle=' + params.middle;

			console.log('params', params, url);

			// владелец потока
			master = manager.factory('httpRequest');

			// запрос на поиск персон
			master.post(
				{
					url: url
				},
				function (response, data)
				{
					console.log('response, data', response, data);

					if (response)
					{

					}
				}
			);
		}
	}
);