/**
 * Поисковое поле по uuid/id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.id.Id',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearch',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.id.IdController'
		],
		controller: 'form.desc.relations.subject.search.id',
		xtype: 'form-desc-relations-subject-searchId',

		queryParam: 'uuid',
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
			'<div class="boundlist-search-item-name">{uuid}</div>',
			'<div class="boundlist-search-item-sub">{last_name} {first_name} {middle_name}</div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-relations-subject');
			store = store || Ext.create('FBEditor.store.desc.relations.Subject');

			return store;
		},

		getQueryParam: function ()
		{
			var me = this,
				val = me.getValue(),
				param;

			// параметр запроса зависит от введенного значения
			param = /^[0-9]{2,}$/.test(val) ? 'person' : 'uuid';

			return param;
		}
	}
);