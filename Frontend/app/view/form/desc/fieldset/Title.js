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
			'FBEditor.view.form.desc.titleArt.TitleArt',
		    'FBEditor.view.panel.cover.Cover'
		],
		xtype: 'desc-fieldset-title',
		layout: 'hbox',
		title: 'Название произведения',
		require: true,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-titleArt',
					flex: 1,
					name: 'title',
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelWidth: 160,
						labelAlign: 'right'
					}
				},
				{
					xtype: 'panel-cover'
				}
			];
			me.callParent(arguments);
		}
	}
);