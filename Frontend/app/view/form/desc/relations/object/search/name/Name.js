/**
 * Поисковое поле по названию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.search.name.Name',
	{
		extend: 'FBEditor.view.field.combosearch.ComboSearch',
		requires: [
			'FBEditor.view.form.desc.relations.object.search.name.NameController'
		],
		controller: 'form.desc.relations.object.search.name',
		xtype: 'form-desc-relations-object-searchName',

		displayField: 'name',
		valueField: 'name',
		listConfig: {
			shadow: false,
			maxHeight: 'auto',
			cls: 'boundlist-object'
		},

		tpl: Ext.create(
			'Ext.XTemplate',
			'<tpl for=".">',
			'<div class="x-boundlist-item boundlist-search-item">',
			'<div class="boundlist-search-item-name">{name}</div>',
			'<div class="boundlist-search-item-sub"><tpl for="persons">{[xindex > 1 ? " / " : ""]}{title}</tpl></div>',
			'<div class="boundlist-search-item-sub"><tpl for="series">{[xindex > 1 ? " / " : ""]}{name}</tpl></div>',
			'<div class="boundlist-search-item-sub">{uuid}</div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-relations-object');
			store = store || Ext.create('FBEditor.store.desc.relations.Object');

			return store;
		},

		getParams: function (val)
		{
			var params;

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
					art: val
				};
			}
			else
			{
				params = {
					q: val
				};
			}

			return params;
		}
	}
);