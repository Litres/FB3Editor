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
		 * @property {FBEditor.view.image.Cover} Изображение обложки.
		 */
		cover: null,

		/**
		 * Устанавливает обложку.
		 * @param {FBEditor.resource.Resource} cover Данные обложки.
		 */
		onLoad: function (cover)
		{
			var me = this,
				img = me.getCover(),
				view = me.getView();

			// обновляем картинку
			img.updateView(cover);
			Ext.defer(
				function ()
				{
					view.updateLayout();
				},
			    400
			);
		},

		/**
		 * Очищает обложку.
		 */
		onClear: function ()
		{
			var me = this,
				img = me.getCover();

			// стираем адрес картинки
			img.setSrc('');
		},

		/**
		 * Возвращает изображение обложки.
		 * @return {FBEditor.view.image.Cover} Изображение обложки.
		 */
		getCover: function ()
		{
			var me = this,
				cover = me.cover || Ext.getCmp('image-cover');

			return cover;
		}
	}
);