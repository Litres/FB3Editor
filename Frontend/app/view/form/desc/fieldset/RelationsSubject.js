/**
 * Связанные персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.RelationsSubject',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.relations.subject.Subject'
		],
		xtype: 'desc-fieldset-relations-subject',
		title: 'Связанные персоны (автор, переводчик и т.д.)',
		xtypeChild: 'relations-subject',
		require: true
	}
);