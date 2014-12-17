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
			'FBEditor.view.form.desc.title.Title',
			'FBEditor.view.form.desc.sequence.Sequence'
		],
		xtype: 'desc-fieldset-title',
		title: 'Название произведения',
		require: true,

		translateText: {
			info: 'Общая информация',
			sequence: 'Серия'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.info,
					require: true,
					items: [
						{
							xtype: 'form-desc-title',
							id: 'form-desc-title',
							name: 'title',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 160,
								labelAlign: 'right'
							}
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.sequence,
					items: [
						{
							xtype: 'form-desc-sequence'
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);