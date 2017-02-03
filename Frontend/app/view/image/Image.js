/**
 * Базовый компонент изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.image.Image',
	{
		extend: 'Ext.Img',
		requires: [
			'FBEditor.view.image.ImageController'
		],
		
		xtype: 'baseimage',
		controller: 'baseimage',
		
		listeners: {
			load: {
				element: 'el',
				fn: 'onLoad'
			}
		},

		/**
		 * @event changeSrc
		 * Обновляет изображение.
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