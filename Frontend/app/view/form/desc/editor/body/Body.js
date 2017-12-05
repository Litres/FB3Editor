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

		resizable: {
			handles: 's',
			minHeight: 100,
			pinned: true
		},

		height: 170,

		createManager: function ()
		{
			var me = this;

			// менеджер редактора текста для описания книги
			me.manager = me.manager || Ext.create('FBEditor.view.form.desc.editor.Manager', me);
		},

		createToolbar: function ()
		{
			var me = this,
				descManager = FBEditor.desc.Manager,
				toolbar;

			// в форме описания используется один общий тулбар
			toolbar = descManager.getToolbar();

			return toolbar;
		}
	}
);