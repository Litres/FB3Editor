/**
 * Кнопка Уборка.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.toolbar.button.cleaner.Cleaner',
	{
		extend: 'Ext.Button',
		requires: [
			'FBEditor.view.form.desc.editor.command.Clean',
			'FBEditor.view.form.desc.editor.toolbar.button.cleaner.CleanerController'
		],

		xtype: 'form-desc-editor-toolbar-button-cleaner',
		controller: 'form.desc.editor.toolbar.button.cleaner',

		html: '<i class="fa fa-paint-brush"></i>',
		tooltip: 'Уборка',
		tooltipType: 'title',
		disabled: true,

		listeners: {
			sync: 'onSync',
			click: 'onClick'
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.view.form.desc.editor.body.Body}
		 */
		getEditor: function ()
		{
			var me = this,
				editor;

			editor = me.editor || me.up('form-desc-editor-toolbar').getEditor();
			me.editor = editor;

			return editor;
		}
	}
);