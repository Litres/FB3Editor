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
		 * @property {Object[]} Ресурсы.
		 */
		data: null,

		/**
		 * @property {String} Корневая директория ресурсов в архиве.
		 */
		rootPath: 'fb3/img',

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
						name: item.getFileName().substring(me.rootPath.length + 1),
						baseName: item.getBaseFileName()
					};
					data.push(imageData);
				}
			);
			Ext.Array.sort(
				data,
			    function (a, b)
			    {
				    return a.name > b.name;
			    }
			);
			me.data = data;
			Ext.getCmp('panel-resources-navigation').loadData(Ext.clone(data));
		},

		/**
		 * Возвращает ресурсы для указанной директории.
		 * @param {String} folder Директория.
		 * @return {Object[]} Ресурсы.
		 */
		getDataFolder: function (folder)
		{
			var me = this,
				data = me.data,
				f = folder,
				dataFolder = [];

			Ext.each(
				data,
			    function (item)
			    {
				    var pos,
					    name = item.name,
					    last;

				    pos = name.indexOf(f);
				    last = pos === 0 ? name.substring(f.length + 1) : null;
				    if (last && last.indexOf('/') === -1)
				    {
					    dataFolder.push(item);
				    }
			    }
			);

			return dataFolder;
		}
	}
);