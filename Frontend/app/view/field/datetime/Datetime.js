/**
 * Дата и время.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.datetime.Datetime',
	{
		extend: 'Ext.form.FieldContainer',
		xtype: 'datetimefield',
		layout: 'hbox',
		combineErrors: true,
		msgTarget: 'side',
		defaults: {
			allowBlank: false,
			flex: 1,
			msgTarget: 'none',
			margin: '0 2 0 0'
		},

		translateText: {
			date: 'Дата',
			time: 'Время'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'datefield',
					fieldLabel: me.translateText.date,
					emptyText: me.translateText.date,
					hideLabel: true
				},
				{
					xtype: 'timefield',
					format: 'H:i:s',
					fieldLabel: me.translateText.time,
					emptyText: me.translateText.time,
					hideLabel: true
				}
			];
			me.callParent(arguments);
		}
	}
);