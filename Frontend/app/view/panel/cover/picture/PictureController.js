/**
 * Контроллер изображения обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.cover.picture.PictureController',
	{
		extend: 'FBEditor.view.image.ImageController',

		alias: 'controller.panel.cover.picture',
		
		onLoad: function ()
		{
			var me = this,
				view = me.getView(),
				panel;
			
			// обновляем макет панели выбора обложки
			panel = view.getPanelCover();
			panel.updateLayout();
		}
	}
);