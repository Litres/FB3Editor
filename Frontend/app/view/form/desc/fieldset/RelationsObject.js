/**
 * Связанные объекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.RelationsObject',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.relations.object.Object'
		],
		xtype: 'desc-fieldset-relations-object',
		title: 'Связанные объекты',
		xtypeChild: 'relations-object'
	}
);