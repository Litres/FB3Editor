/**
 * Изображение обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.cover.picture.Picture',
	{
		extend: 'FBEditor.view.image.Image',
		requires: [
			'FBEditor.view.panel.cover.picture.PictureController'
		],

		xtype: 'panel-cover-picture',
		id: 'panel-cover-picture',
		controller: 'panel.cover.picture',

		margin: '10 0 0 0',
		style: {
			maxWidth: '150px',
			maxHeight: '300px'
		},

		/**
		 * @private
		 * @property {FBEditor.view.panel.cover.Cover} Панель выбора обложки.
		 */
		panelCover: null,

		constructor: function (config)
		{
			var me = this;

			me.panelCover = config.panelCover;
			me.callParent(arguments);
		},

		/**
		 * Возвращает панель выбора обложки.
		 * @return {FBEditor.view.panel.cover.Cover}
		 */
		getPanelCover: function ()
		{
			return this.panelCover;
		}
	}
);