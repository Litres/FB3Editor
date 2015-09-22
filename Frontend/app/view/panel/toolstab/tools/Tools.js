/**
 * Вкладка Инструменты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.tools.Tools',
	{
		extend: 'Ext.panel.Panel',
		id:'panel-toolstab-tools',
		xtype: 'panel-toolstab-tools',
		title: 'Инструменты',

		translateText: {
			version: 'Версия: '
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'component',
					padding: 10,
					style: {
						color: 'gray'
					},
					html: me.translateText.version + FBEditor.version
				}
			];

			me.callParent(arguments);
		}
	}
);