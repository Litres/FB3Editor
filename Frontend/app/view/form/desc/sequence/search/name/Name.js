/**
 * Поисковое поле по названию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.name.Name',
	{
		extend: 'FBEditor.view.form.desc.searchField.SearchField',
		requires: [
			'FBEditor.view.form.desc.sequence.search.name.NameController',
			'FBEditor.view.form.desc.sequence.search.name.window.Window'
		],
		controller: 'form.desc.sequence.search.name',
		xtype: 'form-desc-sequence-searchName',

		createWindow: function ()
		{
			var me = this,
				win;

			win = Ext.create(
				{
					xtype: 'form-desc-sequence-searchName-window',
					alignTarget: me.getId()
				}
			);

			return win;
		},

		search: function ()
		{
			var me = this,
				val = me.getValue(),
				win = me.getWindow(),
				params = me.getParams();

			if (val.length > 1)
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
					series: val
				};
			}
			else
			{
				params = {
					q: val
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
				'sequence-id': data.uuid,
				'sequence-title-main': data['name'] ? data['name'] : ''
			};

			// заполняем фому ручного ввода
			descManager.loadingProcess = true;
			container.updateData(d);
			descManager.loadingProcess = false;

			// убираем редактируемость полей
			container.fireEvent('editable', false);

			// скрываем поля поиска и показываем данные
			btn = me.up('desc-fieldcontainer').down('form-desc-sequence-customBtn');
			btn.switchContainers();
		},

		getFirstSearch: function ()
		{
			var me = this,
				searchField;

			searchField = me.up('form-desc-sequence').down('form-desc-sequence-searchName');

			return searchField;
		},

		getNextSearch: function ()
		{
			var me = this,
				searchField,
				next;

			next = me.up('[plugins]').nextSibling();
			searchField = next.down('form-desc-sequence-searchName');

			return searchField;
		}
	}
);