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
			'FBEditor.view.panel.cover.picture.Picture',
			'FBEditor.view.button.SelectCover'
		],
		
		xtype: 'panel-cover',
		id: 'panel-cover',
		controller: 'panel.cover',
		
		margin: '0 0 0 40',
		listeners: {
			load: 'onLoad',
			clear: 'onClear'
		},

		/**
		 * @private
		 * @property {FBEditor.view.panel.cover.picture.Picture} Изображение обложки.
		 */
		picture: null,

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
					xtype: 'panel-cover-picture',
					panelCover: me
				}
			];
			
			me.callParent(arguments);
		},

		/**
		 * Возвращает изображение обложки.
		 * @return {FBEditor.view.panel.cover.picture.Picture} Изображение обложки.
		 */
		getCoverPicture: function ()
		{
			var me = this,
				picture;

			picture = me.picture || me.down('panel-cover-picture');
			me.picture = picture;

			return picture;
		}
	}
);