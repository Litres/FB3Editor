/**
 * Поисковое поле по uuid/id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.id.Id',
	{
		extend: 'FBEditor.view.form.desc.relations.subject.search.name.Name',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.id.IdController'
		],
		controller: 'form.desc.relations.subject.search.id',
		xtype: 'form-desc-relations-subject-searchId',

		queryParam: 'uuid',

		tpl: Ext.create(
			'Ext.XTemplate',
			'<tpl for=".">',
			'<div class="x-boundlist-item boundlist-person-item">',
			'<div class="boundlist-person-item-last-name">{uuid}</div>',
			'<div class="boundlist-person-item-first-name">{last_name} {first_name} {middle_name}</div>',
			'</div>',
			'</tpl>'
		),

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