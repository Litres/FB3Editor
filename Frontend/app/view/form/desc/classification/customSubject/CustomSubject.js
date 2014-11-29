/**
 * Новый жанр.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.customSubject.CustomSubject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'classification-custom-subject',
		layout: 'hbox',
		anchor: '100%',
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'classification-custom-subject',
			btnStyle: {
				margin: '0 0 0 5px'
			}
		},

		translateText: {
			customSubject: 'Новый жанр'
		},

		initComponent: function ()
		{
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'textfield',
					name: 'classification-custom-subject',
					flex: 1,
					fieldLabel: me.translateText.customSubject,
					labelAlign: 'right',
					labelWidth: 160,
					labelStyle: labelStyleAllow
				}
			];
			me.callParent(arguments);
		}
	}
);