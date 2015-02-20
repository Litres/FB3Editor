/**
 * Панель выбора обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.cover.Cover',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.cover.CoverController',
			'FBEditor.view.button.SelectCover',
			'FBEditor.view.image.Cover'
		],
		xtype: 'panel-cover',
		id: 'panel-cover',
		controller: 'panel.cover',
		margin: '0 0 0 40',
		listeners: {
			load: 'onLoad'
		},

		translateText: {
			cover: 'Обложка'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'box',
							style: {
								margin: '0 10px 0 0',
								fontSize: '15px'
							},
							html: me.translateText.cover + ':'
						},
						{
							xtype: 'button-select-cover'
						}
					]
				},
				{
					xtype: 'image-cover'
				}
			];
			me.callParent(arguments);
		}
	}
);