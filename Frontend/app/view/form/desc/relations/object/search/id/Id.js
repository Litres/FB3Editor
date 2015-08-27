/**
 * Поисковое поле по uuid/id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.search.id.Id',
	{
		extend: 'FBEditor.view.form.desc.relations.object.search.name.Name',
		requires: [
			'FBEditor.view.form.desc.relations.object.search.id.IdController'
		],
		controller: 'form.desc.relations.object.search.id',
		xtype: 'form-desc-relations-object-searchId',

		queryParam: 'uuid',

		tpl: Ext.create(
			'Ext.XTemplate',
			'<tpl for=".">',
			'<div class="x-boundlist-item boundlist-object-item">',
			'<div class="boundlist-object-item-name">{uuid}</div>',
			'<div class="boundlist-object-item-persons">{name}</div>',
			'<div class="boundlist-object-item-persons"><tpl for="persons">{[xindex > 1 ? " / " : ""]}{title}</tpl></div>',
			'<div class="boundlist-object-item-persons"><tpl for="series">{[xindex > 1 ? " / " : ""]}{name}/</tpl></div>',
			'</div>',
			'</tpl>'
		),

		getQueryParam: function ()
		{
			var me = this,
				val = me.getValue(),
				param;

			// параметр запроса зависит от введенного значения
			param = /^[0-9]{2,}$/.test(val) ? 'art' : 'uuid';

			return param;
		}
	}
);