/**
 * Поисковое поле по uuid/id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.id.Id',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearch',
		requires: [
			'FBEditor.view.form.desc.sequence.search.id.IdController'
		],
		controller: 'form.desc.sequence.search.id',
		xtype: 'form-desc-sequence-searchId',

		queryParam: 'uuid',
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
			'<div class="boundlist-search-item-name">{uuid}</div>',
			'<div class="boundlist-search-item-sub">{name}</div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-sequence');
			store = store || Ext.create('FBEditor.store.desc.sequence.Sequence');

			return store;
		},

		getQueryParam: function ()
		{
			var me = this,
				val = me.getValue(),
				param;

			// параметр запроса зависит от введенного значения
			param = /^[0-9]{2,}$/.test(val) ? 'series' : 'uuid';

			return param;
		}
	}
);