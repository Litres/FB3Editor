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

		queryParam: 'q',
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
			'<div class="x-boundlist-item boundlist-object-item">',
			'<div class="boundlist-object-item-name">{name}</div>',
			'<div class="boundlist-object-item-persons"><tpl for="persons">{[xindex > 1 ? " / " : ""]}{title}</tpl></div>',
			'<div class="boundlist-object-item-persons"><tpl for="series">{[xindex > 1 ? " / " : ""]}{name}</tpl></div>',
			'</div>',
			'</tpl>'
		),

		getCreateStore: function ()
		{
			var store;

			store = Ext.data.StoreManager.lookup('desc-relations-object');
			store = store || Ext.create('FBEditor.store.desc.relations.Object');

			return store;
		}
	}
);