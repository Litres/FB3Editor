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
		
		border: false,

		afterRender: function ()
		{
			var me = this,
				cmp,
				cleanBtn;

			me.callParent(arguments);

            // кнопка уборки
            cleanBtn = Ext.widget('form-desc-editor-toolbar-button-cleaner');
            cleanBtn.setToolbar(me);
            
            cmp = {
	            xtype: 'container',
	            cls: 'panel-toolstab-container',
	            layout: 'hbox',
	            height: 45,
	            items: [
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
		            {
			            xtype: 'tbspacer'
		            },
		            cleanBtn
	            ]
            };

            me.add(cmp);

			me.addSyncButton('form-desc-editor-toolbar-button-cleaner');
		}
	}
);