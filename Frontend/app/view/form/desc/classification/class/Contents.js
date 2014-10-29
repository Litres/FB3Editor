/**
 * Список типов содержимого литературной формы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.class.Contents',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.classification.class.ContentsStore'
		],
		xtype: 'form-desc-classification-class-contents',
		queryMode: 'local',
		displayField: 'value',
		valueField: 'value',
		fieldLabel: 'Тип содержимого литературной формы',
		name: 'classification-class-contents',
		allowBlank: false,
		editable: false,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.classification.class.ContentsStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);