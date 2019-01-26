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
			'FBEditor.view.panel.toolstab.button.find.Find',
			'FBEditor.view.panel.toolstab.button.replace.Replace',
            'FBEditor.view.panel.toolstab.tools.button.hotkeys.Hotkeys',
			'FBEditor.view.panel.toolstab.tools.button.unprintsymbols.UnprintSymbols',
            'FBEditor.view.panel.toolstab.tools.button.xmlwordwrap.XmlWordWrap'
		],

		id:'panel-toolstab-tools',
		xtype: 'panel-toolstab-tools',

		title: 'Инструменты',

		translateText: {
			version: 'Версия: '
		},

		initComponent: function ()
		{
			var me = this,
				version;

			version = FBEditor.version;

			me.tbar = [
				{
					xtype: 'component',
					style: {
						color: 'gray'
					},
					html: me.translateText.version + version
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-tools-button-unprintsymbols'
				},
                {
                    xtype: 'panel-toolstab-tools-button-xmlwordwrap'
                },
                {
                    xtype: 'panel-toolstab-tools-button-hotkeys'
                },
				{
					xtype: 'panel-toolstab-button-find'
				},
				{
					xtype: 'panel-toolstab-button-replace'
				}
			];

			me.callParent(arguments);
		}
	}
);