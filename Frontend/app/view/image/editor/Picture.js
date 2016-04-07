/**
 * Изображение в окне создания/редактирования изображения текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.image.editor.Picture',
	{
		extend: 'Ext.Img',
		xtype: 'image-editor-picture',

		style: {
			maxWidth: '150px',
			maxHeight: '200px'
		},
		src: 'undefined',

		/**
		 * @event changeSrc
		 * Обновляет картинку.
		 * @param {Object} data Данные изображения.
		 */
		updateView: function (data)
		{
			var me = this,
				img = data;

			if (img.url !== me.src)
			{
				me.setSrc(img.url);
				me.fireEvent('changeSrc', me);
			}
		}
	}
);