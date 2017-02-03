/**
 * Контроллер панели выбора обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.cover.CoverController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.cover',

		/**
		 * Устанавливает обложку.
		 * @param {FBEditor.resource.Resource} cover Данные обложки.
		 */
		onLoad: function (cover)
		{
			var me = this,
				view = me.getView(),
				img = view.getCoverPicture();

			// обновляем картинку
			img.updateView(cover);
		},

		/**
		 * Очищает обложку.
		 */
		onClear: function ()
		{
			var me = this,
				view = me.getView(),
				img = view.getCoverPicture();

			// стираем адрес картинки
			img.setSrc('');
		}
	}
);