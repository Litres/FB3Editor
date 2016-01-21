/**
 * Поисковое поле по фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.Name',
	{
		extend: 'FBEditor.view.form.desc.searchField.SearchField',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.NameController',
		    'FBEditor.view.form.desc.relations.subject.search.name.window.Window'
		],
		controller: 'form.desc.relations.subject.search.name',
		xtype: 'form-desc-relations-subject-searchName',

		createWindow: function ()
		{
			var me = this,
				win;

			win = Ext.create(
				{
					xtype: 'form-desc-relations-subject-searchName-window',
					alignTarget: me.getId()
				}
			);
			
			return win;
		},

		search: function ()
		{
			var me = this,
				win = me.getWindow(),
				params = me.getParams();

			if (params.last.length > 1 || params.first.length > 1 || params.middle.length > 1)
			{
				win.fireEvent('loadData', params);
			}
			else
			{
				me.abortSearch();
			}
		},

		getParams: function ()
		{
			var me = this,
				val = me.getValue(),
				reg1,
				reg2,
				values,
				params;

			// параметры запроса зависят от введенного значения

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

				// формируем параметры для запроса
				params = {
					last: values[0],
					first: values[1] ? values[1] : '',
					middle: values[2] ? values[2] : ''
				};
			}

			return params;
		},

		updateData: function (data)
		{
			var me = this,
				descManager = FBEditor.desc.Manager,
				btn,
				d,
				container;

			container = me.up('[name=plugin-fieldcontainerreplicator]');
			d = {
				'relations-subject-id': data.uuid,
				'relations-subject-last-name': data['last_name'] ? data['last_name'] : '',
				'relations-subject-first-name': data['first_name'] ? data['first_name'] : '',
				'relations-subject-middle-name': data['middle_name'] ? data['middle_name'] : '',
				'relations-subject-title-main': data['title'] ? data['title'] : ''
			};

			// заполняем фому ручного ввода
			descManager.loadingProcess = true;
			container.updateData(d);
			descManager.loadingProcess = false;

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = me.up('desc-fieldcontainer').down('form-desc-relations-subject-customBtn');
			btn.switchContainers();
		},

		getFirstSearch: function ()
		{
			var me = this,
				searchField;

			searchField = me.up('form-desc-relations-subject').down('form-desc-relations-subject-searchName');

			return searchField;
		},

		getNextSearch: function ()
		{
			var me = this,
				searchField,
				next;

			next = me.up('[plugins]').nextSibling();
			searchField = next.down('form-desc-relations-subject-searchName');

			return searchField;
		}
	}
);