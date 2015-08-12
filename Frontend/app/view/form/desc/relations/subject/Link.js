/**
 * Тип связи персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Link',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.LinkController',
			'FBEditor.view.form.desc.relations.subject.radio.Radio',
			'FBEditor.view.form.desc.relations.subject.LinkList'
		],
		xtype: 'form-desc-relations-subject-link',
		controller: 'form.desc.relations.subject.link',
		layout: 'hbox',
		//viewModel: true,
		//referenceHolder: true,
		listeners: {
			resetFields: 'onResetFields',
			loadData: 'onLoadData',
			changeList: 'onChangeList'
		},

		translateText: {
			label: 'Тип связи'
		},

		initComponent: function ()
		{
			var me = this;

			me.fieldLabel = me.translateText.label;
			me.items = [
				{
					xtype: 'relations-subject-link-radio'
				},
				{
					xtype: 'form-desc-relations-subject-link-list',
					flex: 1,
					margin: '0 0 0 10'
				}
			];
			me.callParent(arguments);
		},

		getValue: function ()
		{
			var me = this,
				data;

			data = me.down('relations-subject-link-radio').getChecked()[0].getGroupValue();
			data = data === 'other-list' ? me.down('form-desc-relations-subject-link-list').getValue() : data;

			return data;
		}
	}
);