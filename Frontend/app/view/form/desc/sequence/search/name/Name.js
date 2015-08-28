/**
 * Поисковое поле по названию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.name.Name',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearch',
		requires: [
			'FBEditor.store.desc.sequence.Sequence',
			'FBEditor.view.form.desc.sequence.search.name.NameController'
		],
		controller: 'form.desc.sequence.search.name',
		xtype: 'form-desc-sequence-searchName',

		queryParam: 'q',
		displayField: 'name',
		valueField: 'name',
		listConfig: {
			shadow: false,
			maxHeight: 'auto',
			cls: 'boundlist-sequence'
		},

		tpl: Ext.create(
			'Ext.XTemplate',
			'<tpl for=".">',
			'<div class="x-boundlist-item boundlist-search-item">',
			'<div class="boundlist-search-item-name">{name}</div>',
			'<div class="boundlist-search-item-sub">{uuid}</div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-sequence');
			store = store || Ext.create('FBEditor.store.desc.sequence.Sequence');

			return store;
		}
	}
);