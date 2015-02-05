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
			Ext.Array.sort(
				data,
			    function (a, b)
			    {
				    return a.name > b.name;
			    }
			);
			Ext.getCmp('panel-resources-navigation').loadData(data);
			//Ext.getCmp('view-resources').setStoreData(data);
		}
	}
);