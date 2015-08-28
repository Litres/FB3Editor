/**
 * Поисковое поле по фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.Name',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearch',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.NameController'
		],
		controller: 'form.desc.relations.subject.search.name',
		xtype: 'form-desc-relations-subject-searchName',

		autoSelect: false,
		queryParam: 'last',
		displayField: 'last_name',
		valueField: 'last_name',
		listConfig: {
			shadow: false,
			maxHeight: 'auto',
			cls: 'boundlist-person'
		},

		tpl: Ext.create(
			'Ext.XTemplate',
			'<tpl for=".">',
			'<div class="x-boundlist-item boundlist-search-item">',
			'<div class="boundlist-search-item-name">{last_name}</div>',
			'<div class="boundlist-search-item-sub">{first_name} {middle_name}</div>',
			'<div class="boundlist-search-item-sub">{uuid}</div>',
			'</div>',
			'</tpl>'
		),

		onPaste: function ()
		{
			// при вставке не отправлять запрос
		},

		onKeyUp: function (e)
		{
			var me = this,
				k = e.getKey();

			// отправляем запрос при нажатии Enter
			if (k === e.ENTER)
			{
				e.isSpecialKey = function ()
				{
					// чтобы запрос отправился, считаем, что нажата не специальная клавиша
					return false;
				};

				me.callParent(arguments);
			}
		},

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-relations-subject');
			store = store || Ext.create('FBEditor.store.desc.relations.Subject');

			return store;
		},

		getParams: function (val)
		{
			var values,
				params;

			// разбиваем строку на три значения, отделенных пробелами
			val = val.trim();
			values = val.split(/[ ]+/, 3);

			//console.log('val', val, values);

			// формируем параметры для запроса
			params = {
				last: values[0],
				first: values[1] ? values[1] : '',
				middle: values[2] ? values[2] : ''
			};

			return params;
		}
	}
);