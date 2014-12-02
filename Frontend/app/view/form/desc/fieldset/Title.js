/**
 * Название произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.Title',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.title.Title'
		],
		xtype: 'desc-fieldset-title',
		title: 'Название произведения',
		require: true,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-title',
					name: 'title',
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelWidth: 160,
						labelAlign: 'right'
					}
				}
			];
			me.callParent(arguments);
		}
	}
);