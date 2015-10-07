/**
 * Преамбула.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.preamble.Preamble',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.fieldset.preamble.PreambleController',
			'FBEditor.view.form.desc.preamble.Preamble'
		],
		xtype: 'desc-fieldset-preamble',
		controller: 'desc.fieldset.preamble',
		title: 'Преамбула',
		xtypeChild: 'preamble'
	}
);