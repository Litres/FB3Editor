/**
 * Серия.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.sequence.Sequence',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.publishInfo.sequence.SequenceController'
		],
		xtype: 'form-desc-publishInfo-sequence',
		id: 'form-desc-publishInfo-sequence',
		controller: 'form.desc.publishInfo.sequence',
		layout: 'hbox',
		defaults: {
			anchor: '100%',
			flex: 1,
			labelWidth: 60,
			labelAlign: 'right'
		},

		/**
		 * @property {String} Имя поля.
		 */
		fieldName: '',

		translateText: {
			sequence: 'Серия'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.fieldName;

			me.plugins = {
				ptype: 'fieldcontainerreplicator',
				groupName: name,
				btnStyle: {
					margin: '0 0 0 5px'
				}
			};
			me.items = [
				{
					xtype: 'textfield',
					name: name,
					fieldLabel: me.translateText.sequence,
					cls: 'field-optional',
					listeners: {
						loadData: function (data)
						{
							me.fireEvent('loadData', data);
						}
					}
				}
			];
			me.callParent(arguments);
		},

		getValues: function ()
		{
			var me = this,
				name = me.fieldName,
				data = [],
				items;

			items = me.ownerCt.query('textfield[name=' + name + ']');
			Ext.each(
				items,
				function (item)
				{
					if (item.getValue())
					{
						data.push(item.getValue());
					}
				}
			);

			return data;
		}
	}
);