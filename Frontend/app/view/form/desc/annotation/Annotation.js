/**
 * Аннотация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.annotation.Annotation',
	{
		extend: 'FBEditor.view.form.desc.htmleditor.HtmlEditor',
		xtype: 'form-desc-annotation',
		name: 'annotation',
		height: 200,
		resizable: {
			handles: 's',
			minHeight: 100,
			pinned: true
		}
	}
);