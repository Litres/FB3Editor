/**
 * Аннотация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.annotation.Annotation',
	{
		extend: 'FBEditor.view.form.desc.htmleditor.HtmlEditor',
		//extend: 'FBEditor.view.form.desc.editor.Editor',

		xtype: 'form-desc-annotation',

		rootElementName: 'desc/annotation',

		name: 'annotation'
	}
);