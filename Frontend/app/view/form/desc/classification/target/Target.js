/**
 * Целевая аудитория.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.Target',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.target.Education'
		],
		xtype: 'form-desc-classification-target',
		fieldLabel: 'Целевая аудитория',

		translateText: {
			desc: 'Описание',
			minAge: 'Минимальный возраст',
			maxAge: 'Максимальный возраст'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'textfield',
					name: 'classification-target',
					fieldLabel: me.translateText.desc,
					emptyText: me.translateText.desc,
					hideLabel: true
				},
				{
					xtype: 'numberfield',
					name: 'classification-target-minAge',
					fieldLabel: me.translateText.minAge,
					emptyText: me.translateText.minAge,
					hideLabel: true,
					minValue: 2,
					maxValue: 50
				},
				{
					xtype: 'numberfield',
					name: 'classification-target-maxAge',
					fieldLabel: me.translateText.maxAge,
					emptyText: me.translateText.maxAge,
					hideLabel: true,
					minValue: 2,
					maxValue: 150
				},
				{
					xtype: 'form-desc-classification-target-education'
				}
			];
			me.callParent(arguments);
		}
	}
);