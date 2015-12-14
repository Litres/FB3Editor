/**
 * Контроллер поискового поля по фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.NameController',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearchController',
		alias: 'controller.form.desc.relations.subject.search.name',

		/**
		 * Вызывается при выборе персоны из списка.
		 * @param {Object} data Данные персоны.
		 */
		onSelect: function (data)
		{
			var me = this,
				view = me.getView(),
				resultContainer = view.resultContainer,
				plugin,
				btnAdd,
				inputSearch;

			// автоматически добавляем новый блок поиска
			plugin = me.getPlugin();
			btnAdd = plugin.getBtnAdd();
			plugin.addFields(btnAdd);

			// устанавливаем курсор в первое поисковое поле
			inputSearch = me.getFirstSearch();
			//inputSearch = me.getNextSearch();
			inputSearch.focus();

			// вырезаем теги жирности из фио
			Ext.Object.each(
				data,
			    function (key, val)
			    {
				    data[key] = Ext.isString(val) ? val.replace(/<[/]?b>/ig, '') : val;
			    }
			);

			me.updateData(data);

			// закрываем окно
			resultContainer.close();

			// сохраняем выбранную запись
			view.saveToStorage(data);
		},

		/**
		 * Вызывается при клике по полю.
		 */
		onClick: function (e, input)
		{
			var me = this,
				view = me.getView(),
				resultContainer = view.resultContainer,
				val;

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			e.stopPropagation();

			val = view.getValue();

			if (val)
			{
				// показываем список, если значение не пустое
				if (!resultContainer.isShow)
				{
					resultContainer.show();
				}
			}
			else
			{
				// при пустом поле показываем список, сохраненный локально
				view.expandStorage();
			}
		},

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				params;

			params = me.getParams();
			me.searchName(params);
		},

		/**
		 * Парсит значение поля и возвращает параметры для запроса.
		 * @return {Object}
		 * @return {String} Object.last
		 * @return {String} Object.first
		 * @return {String} Object.middle
		 */
		getParams: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue(),
				reg1,
				reg2,
				values,
				params;

			// параметр запроса зависит от введенного значения

			if (/^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(val))
			{
				params = {
					uuid: val
				};
			}
			else if (/^[0-9]{2,}$/.test(val))
			{
				params = {
					person: val
				};
			}
			else
			{
				val = val.trim();
				reg1 = /^(.*?)[ ]+(.?)\.(?:[ ]?(.?)\.)?$/i;
				reg2 = /^(.?)\.(?:[ ]?(.?)\.)?[ ]+(.*?)$/i;

				if (reg1.test(val))
				{
					// разбиваем строку типа Фамилия И.О. | Фамилия И.
					values = val.match(reg1);
					values = {
						0: values[1],
						1: values[2],
						2: values[3]
					};
				}
				else if (reg2.test(val))
				{
					// разбиваем строку типа И.О. Фамилия | И. Фамилия
					values = val.match(reg2);
					values = {
						0: values[3],
						1: values[1],
						2: values[2]
					};
				}
				else
				{
					// разбиваем строку на три значения, отделенных пробелами
					values = val.split(/[ ]+/, 3);
				}

				//console.log('val', val, values);

				// формируем параметры для запроса
				params = {
					last: values[0],
					first: values[1] ? values[1] : '',
					middle: values[2] ? values[2] : ''
				};
			}

			return params;
		},

		/**
		 * Ищет персоны по ФИО.
		 * @param names ФИО.
		 * @param {String} names.last
		 * @param {String} names.first
		 * @param {String} names.middle
		 */
		searchName: function (names)
		{
			var me = this,
				view = me.getView(),
				resultContainer;

			if (names.last.length > 1 || names.first.length > 1 || names.middle.length > 1)
			{
				resultContainer = view.getResultContainer();
				resultContainer.fireEvent('loadData', names);
				resultContainer.show();
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
		 * Возвращает первое поисковое поле.
		 * @return {FBEditor.view.form.desc.relations.subject.search.name.Name}
		 */
		getFirstSearch: function ()
		{
			var me = this,
				view = me.getView(),
				inputSearch;

			inputSearch = view.up('form-desc-relations-subject').down('form-desc-relations-subject-searchName');

			return inputSearch;
		},

		/**
		 * @private
		 * Возвращает следующее поисковое поле.
		 * @return {FBEditor.view.form.desc.relations.subject.search.name.Name}
		 */
		getNextSearch: function ()
		{
			var me = this,
				view = me.getView(),
				inputSearch,
				next;

			next = view.up('[plugins]').nextSibling();
			inputSearch = next.down('form-desc-relations-subject-searchName');

			return inputSearch;
		},

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
				'relations-subject-id': data.uuid,
				'relations-subject-last-name': data['last_name'] ? data['last_name'] : '',
				'relations-subject-first-name': data['first_name'] ? data['first_name'] : '',
				'relations-subject-middle-name': data['middle_name'] ? data['middle_name'] : '',
				'relations-subject-title-main': data['title'] ? data['title'] : ''
			};

			// заполняем фому ручного ввода автоматически
			descManager.loadingProcess = true;
			container.updateData(d);
			descManager.loadingProcess = false;

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = view.up('desc-fieldcontainer').down('form-desc-relations-subject-customBtn');
			btn.switchContainers();
		}
	}
);