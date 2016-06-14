/**
 * Вкладка Инструменты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.tools.Tools',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.tools.button.paragraph.Paragraph'
		],

		id:'panel-toolstab-tools',
		xtype: 'panel-toolstab-tools',

		title: 'Инструменты',

		translateText: {
			version: 'Версия: '
		},

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'component',
					style: {
						color: 'gray'
					},
					html: me.translateText.version + FBEditor.version
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-tools-button-paragraph'
				}
			];

			me.callParent(arguments);
		}
	}
);