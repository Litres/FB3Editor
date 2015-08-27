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
			'<div class="x-boundlist-item boundlist-person-item">',
			'<div class="boundlist-person-item-last-name">{last_name}</div>',
			'<div class="boundlist-person-item-first-name">{first_name} {middle_name}</div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-relations-subject');
			store = store || Ext.create('FBEditor.store.desc.relations.Subject');

			return store;
		}
	}
);