/**
 * Отображает стандартное написание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.title.Title',
	{
		extend: 'Ext.form.field.Display',

		xtype: 'form-desc-relations-subject-custom-viewer-title',

		fieldLabel: ' ',
		labelWidth: 0,
		labelAlign: 'left',
		labelPad: 2,
		
		initComponent: function ()
		{
			var me = this;

			me.value = 'Стандартное написание';

			me.callParent(arguments);
		}
	}
);