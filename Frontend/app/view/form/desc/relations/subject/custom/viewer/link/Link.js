/**
 * Отображает тип связи.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.link.Link',
	{
		extend: 'Ext.form.field.Display',

		xtype: 'form-desc-relations-subject-custom-viewer-link',

		initComponent: function ()
		{
			var me = this;

			me.value = 'Тип связи';

			me.callParent(arguments);
		}
	}
);