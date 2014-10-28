/**
 * Все связанные с данным документом персоны и объекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.Relations',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.Subject'
		],
		xtype: 'form-desc-relations',
		items: [
			{
				xtype: 'form-desc-relations-subject',
				layout: 'anchor',
				defaults: {
					anchor: '100%'
				}
			}
		]
	}
);