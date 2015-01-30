/**
 * Контроллер панели ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.ResourcesController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.resources',

		/**
		 * Загружает изображения в редактор ресурсов.
		 * @param {FBEditor.FB3.rels.Image} images Изображения, полученные из архива открытой книги.
		 */
		onLoadImages: function (images)
		{
			var me = this,
				view = me.getView(),
				data = [];

			Ext.each(
				images,
			    function (item)
			    {
				    var imageData;

				    imageData = {
					    url: item.getUrl(),
					    name: item.getBaseFileName()
				    };
				    data.push(imageData);
			    }
			);
			Ext.getCmp('view-resources').setStoreData(data);
		}
	}
);