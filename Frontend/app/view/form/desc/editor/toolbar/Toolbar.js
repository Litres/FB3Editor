/**
 * Панель кнопок форматирования для редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.toolbar.Toolbar',
	{
		extend: 'FBEditor.editor.view.toolbar.Toolbar',
		requires: [
			'FBEditor.view.form.desc.editor.toolbar.button.cleaner.Cleaner'
		],

		xtype: 'form-desc-editor-toolbar',

		afterRender: function ()
		{
			var me = this,
				cleanBtn;

			me.callParent(arguments);

			// добавляем кнопку уборки
			cleanBtn = [
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'form-desc-editor-toolbar-button-cleaner'
				}
			];
			me.add(cleanBtn);
		}
	}
);