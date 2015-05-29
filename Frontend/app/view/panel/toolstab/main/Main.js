/**
 * Вкладка Форматирование.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.Main',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.annotation.Annotation',
			'FBEditor.view.panel.toolstab.main.button.div.Div',
			'FBEditor.view.panel.toolstab.main.button.epigraph.Epigraph',
			'FBEditor.view.panel.toolstab.main.button.title.Title'
		],
		id:'panel-toolstab-main',
		xtype: 'panel-toolstab-main',
		title: 'Форматирование',

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'panel-toolstab-main-button-title'
				},
				{
					xtype: 'panel-toolstab-main-button-epigraph'
				},
				{
					xtype: 'panel-toolstab-main-button-annotation'
				},
				{
					xtype: 'panel-toolstab-main-button-div'
				}
			];
			me.callParent(arguments);
		}
	}
);