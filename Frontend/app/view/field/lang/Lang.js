/**
 * Список языков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.lang.Lang',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.field.lang.LangController',
			'FBEditor.view.field.lang.LangStore'
		],
		controller: 'langfield',
		xtype: 'langfield',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		editable: true,
		typeAhead: true,
		value: '',
		hideTrigger: true,
		listConfig: {
			maxHeight: 210,
			tpl : '<tpl for="."><tpl if="value!=\'line\'"><div class="x-boundlist-item">{name}</div>' +
			      '<tpl else><div class="x-boundlist-item x-boundlist-item-line"></div></tpl></tpl>'
		},

		triggers: {
			ru: {
				cls: 'langfield-trigger',
				extraCls: 'langfield-trigger-ru',
				hidden: false,
				scope: 'this',
				handler: function (self, trigger)
				{
					this.onTrigger.apply(this, arguments);
				}
			},
			en: {
				cls: 'langfield-trigger',
				extraCls: 'langfield-trigger-en',
				hidden: false,
				scope: 'this',
				handler: function (self, trigger)
				{
					this.onTrigger.apply(this, arguments);
				}
			},
			fr: {
				cls: 'langfield-trigger',
				extraCls: 'langfield-trigger-fr',
				hidden: false,
				scope: 'this',
				handler: function (self, trigger)
				{
					this.onTrigger.apply(this, arguments);
				}
			},
			de: {
				cls: 'langfield-trigger',
				extraCls: 'langfield-trigger-de',
				hidden: false,
				scope: 'this',
				handler: function (self, trigger)
				{
					this.onTrigger.apply(this, arguments);
				}
			}
		},

		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.field.lang.LangStore');
			me.store = store;

			me.callParent(arguments);
		},

		/**
		 * Устанавливает язык в поле после нажатия на триггер.
		 * @param self
		 * @param trigger
		 * @param evt
		 */
		onTrigger: function (self, trigger, evt)
		{
			var me = this,
				lang = trigger.id;

			me.setValue(lang);
			evt.stopPropagation();
		}
	}
);