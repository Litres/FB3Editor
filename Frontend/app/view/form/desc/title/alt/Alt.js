/**
 * Альтернативное название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.title.alt.Alt',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.title.alt.AltController'
		],
		xtype: 'form-desc-title-alt',
		controller: 'form.desc.title.alt',
		layout: 'hbox',
		defaults: {
			anchor: '100%',
			flex: 1,
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {String} Название метки.
		 */
		fieldLabelAlt: '',

		/**
		 * @property {String} Имя поля.
		 */
		fieldName: '',

		initComponent: function ()
		{
			var me = this,
				name = me.fieldName + '-alt';

			me.plugins = {
				ptype: 'fieldcontainerreplicator',
					groupName: name,
					btnStyle: {
					margin: '3px 0 0 5px'
				}
			};
			me.items = [
				{
					xtype: 'textfield',
					name: name,
					fieldLabel: me.fieldLabelAlt,
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
		}
	}
);