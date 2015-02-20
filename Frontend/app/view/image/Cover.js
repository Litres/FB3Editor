/**
 * Обложка.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.image.Cover',
	{
		extend: 'Ext.Img',
		xtype: 'image-cover',
		id: 'image-cover',
		margin: '10 0 0 0',
		style: {
			maxWidth: '150px',
			maxHeight: '300px'
		},

		/**
		 * Обновляет картинку.
		 * @param {FBEditor.cover.Cover} cover Данные обложки.
		 */
		updateView: function (cover)
		{
			var me = this,
				img = cover;

			me.setSrc(img.url);
		}
	}
);