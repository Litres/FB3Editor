/**
 * Менеджер ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Manager',
	{
		singleton: true,

		/**
		 * @property {FBEditor.FB3.rels.Image[]} Изображения, полученные из архива открытой книги.
		 */
		data: null,

		/**
		 * Загружает данные ресурсов в редактор.
		 * @param {FBEditor.FB3.rels.Image[]} images Изображения, полученные из архива открытой книги.
		 */
		load: function (images)
		{
			var me = this,
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
			me.data = data;
			/*data = [
				{
					name: 'picture.jpg'
				},
				{
					name: 'sub/pictureG.jpg'
				},
				{
					name: 'sub/pictureB.jpg'
				},
				{
					name: 'sub/pictureA.jpg'
				},
				{
					name: 'sub/sub2/test.svg'
				},
				{
					name: 'sub/sub2/himan.svg'
				},
				{
					name: 'children/childB.png'
				},
				{
					name: 'aborts/abortF.gif'
				}
			];*/
			Ext.getCmp('panel-resources-navigation').loadData(data);
			//Ext.getCmp('view-resources').setStoreData(data);
		}
	}
);