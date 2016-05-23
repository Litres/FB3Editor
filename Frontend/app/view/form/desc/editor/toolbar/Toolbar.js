/**
 * Панель кнопок для редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.toolbar.Toolbar',
	{
		extend: 'Ext.Toolbar',

		xtype: 'form-desc-editor-toolbar',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					text: 'Test'
				}
			];

			me.callParent(arguments);
		}
	}
);