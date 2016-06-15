/**
 * Редактор текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.body.Body',
	{
		extend: 'FBEditor.editor.view.Editor',
		requires: [
			'FBEditor.view.form.desc.editor.toolbar.Toolbar'
		],

		xtype: 'form-desc-editor-body',
		cls: 'form-desc-editor-body',

		height: 170,
		resizable: {
			handles: 's',
			minHeight: 100,
			pinned: true
		},

		createToolbar: function ()
		{
			return Ext.create('FBEditor.view.form.desc.editor.toolbar.Toolbar');
		}
	}
);