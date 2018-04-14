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

		id: 'form-desc-editor-toolbar',
		xtype: 'form-desc-editor-toolbar',

		afterRender: function ()
		{
			var me = this,
				cleanBtn;

			me.callParent(arguments);

            // кнопка уборки
            cleanBtn = Ext.widget('form-desc-editor-toolbar-button-cleaner');
            cleanBtn.setToolbar(me);

            me.add(
            	[
					{
						xtype: 'editor-toolbar-button-strong'
					},
					{
						xtype: 'editor-toolbar-button-em'
					},
					{
						xtype: 'editor-toolbar-button-a'
					},
					{
						xtype: 'editor-toolbar-button-unstyle'
					},
					/*,
					{
						xtype: 'tbspacer',
						width: 20
					},
					{
						xtype: 'editor-toggleButton'
					},*/
                    {
                        xtype: 'tbspacer',
                        width: 20
                    },
                    cleanBtn
				]
			);

			me.addSyncButton('form-desc-editor-toolbar-button-cleaner');
		}
	}
);