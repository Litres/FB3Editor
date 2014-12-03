/**
 * Аннотация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.annotation.Annotation',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.fieldset.annotation.AnnotationController',
			'FBEditor.view.form.desc.annotation.Annotation'
		],
		xtype: 'desc-fieldset-annotation',
		controller: 'desc.fieldset.annotation',
		title: 'Аннотация',
		xtypeChild: 'annotation'
	}
);