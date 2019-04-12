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
			'FBEditor.view.panel.toolstab.view.button.split.Split',
			'FBEditor.view.panel.toolstab.view.button.focusdetachpanels.FocusDetachPanels',
            'FBEditor.view.panel.toolstab.tools.button.hotkeys.Hotkeys',
			'FBEditor.view.panel.toolstab.tools.button.outputsection.OutputSection',
			'FBEditor.view.panel.toolstab.tools.button.unprintsymbols.UnprintSymbols',
            'FBEditor.view.panel.toolstab.tools.button.xmlwordwrap.XmlWordWrap'
		],

		id:'panel-toolstab-tools',
		xtype: 'panel-toolstab-tools',
		
		layout: {
			type: 'hbox',
			align: 'left'
		},

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
					xtype: 'container',
					cls: 'panel-toolstab-container',
					layout: 'hbox',
					height: 45,
					items: [
						{
							// версия приложения
							xtype: 'component',
							style: {
								margin: '14px 5px 0 0',
								color: 'gray'
							},
							html: me.translateText.version + version
						},
						{
							xtype: 'tbspacer'
						},
						{
							xtype: 'panel-toolstab-view-button-split'
						},
						{
							xtype: 'panel-toolstab-view-button-focusdetachpanels'
						},
						{
							xtype: 'tbspacer'
						},
						{
							xtype: 'panel-toolstab-tools-button-outputsection'
						},
						{
							xtype: 'panel-toolstab-tools-button-unprintsymbols'
						},
						{
							xtype: 'panel-toolstab-tools-button-xmlwordwrap'
						},
						{
							xtype: 'panel-toolstab-tools-button-hotkeys'
						}
					]
				}
			];

			me.callParent(arguments);
		}
	}
);