/**
 * Редактор текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.body.Body',
	{
		extend: 'FBEditor.editor.view.Editor',

		xtype: 'form-desc-editor-body',
		cls: 'form-desc-editor-body',

		height: 170,
		resizable: {
			handles: 's',
			minHeight: 100,
			pinned: true
		}
	}
);