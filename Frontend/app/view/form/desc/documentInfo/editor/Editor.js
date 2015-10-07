/**
 * Поле - Редактор.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.editor.Editor',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.documentInfo.editor.EditorController'
		],
		xtype: 'form-desc-documentInfo-editor',
		controller: 'form.desc.documentInfo.editor',
		listeners: {
			change: 'onChange'
		},

		initComponent: function ()
		{
			var me = this,
				store = FBEditor.getLocalStorage(),
				val;

			val = store.getItem('form-desc-documentInfo-editor') || '';
			me.value = val;

			me.callParent(arguments);
		}
	}
);