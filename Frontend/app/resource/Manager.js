/**
 * Менеджер ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.resource.Resource'
		],

		/**
		 * @property {FBEditor.resource.Resource[]} Ресурсы.
		 */
		data: [],

		/**
		 * @property {String} Корневая директория ресурсов в архиве.
		 */
		rootPath: 'fb3/img',

		/**
		 * @property {String[]} Допустимые mime-типы.
		 */
		types: [
			'image/png',
			'image/jpeg',
			'image/gif',
			'image/svg+xml'
		],

		/**
		 * @private
		 * @property {String} Активная директория дерева навигации.
		 */
		_activeFolder: '',

		/**
		 * Загружает ресурс из файла.
		 * @param {Object} data Данные ресурса.
		 */
		loadResource: function (data)
		{
			var me = this,
				file = data.file,
				content = data.content,
				bridgeNavigation = FBEditor.getBridgeNavigation(),
				name,
				res,
				resData,
				url,
				blob;

			if (!me.checkType(file.type))
			{
				throw Error('Недопустимый тип ресурса');
			}
			blob = new Blob([content], {type: file.type});
			url = window.URL.createObjectURL(blob);
			name = me._activeFolder + (me._activeFolder ? '/' : '') + file.name;
			resData = {
				url: url,
				name: name,
				baseName: file.name,
				date: file.lastModifiedDate,
				size: file.size,
				type: file.type
			};
			res = Ext.create('FBEditor.resource.Resource', resData);
			console.log(res);
			me.data.push(res);
			me.sortData();
			bridgeNavigation.Ext.getCmp('panel-resources-navigation').loadData(Ext.clone(me.data));
		},

		/**
		 * Загружает данные ресурсов в редактор.
		 * @param {FBEditor.FB3.rels.Image[]} images Изображения, полученные из архива открытой книги.
		 */
		load: function (images)
		{
			var me = this,
				data = [],
				bridgeNavigation = FBEditor.getBridgeNavigation();

			Ext.each(
				images,
				function (item)
				{
					var res,
						resData;

					resData = {
						url: item.getUrl(),
						name: item.getFileName().substring(me.rootPath.length + 1),
						baseName: item.getBaseFileName(),
						date: item.getDate(),
						size: FBEditor.util.Format.fileSize(item.getSize()),
						type: item.getType()
					};
					res = Ext.create('FBEditor.resource.Resource', resData);
					data.push(res);
				}
			);
			me.data = data;
			me.sortData();
			bridgeNavigation.Ext.getCmp('panel-resources-navigation').loadData(Ext.clone(me.data));
		},

		/**
		 * Сортирует ресурсы.
		 */
		sortData: function ()
		{
			var me = this,
				data = me.data;

			Ext.Array.sort(
				data,
				function (a, b)
				{
					return a.name > b.name;
				}
			);
			me.data = data;
		},

		/**
		 * Устанавливает активную директорию дерева навигации.
		 * @param {String} folder Директория.
		 */
		setActiveFolder: function (folder)
		{
			this._activeFolder = folder;
		},

		/**
		 * Возвращает активную директорию дерева навигации.
		 * @param {String} folder Директория.
		 */
		getActiveFolder: function (folder)
		{
			return this._activeFolder;
		},

		/**
		 * Возвращает ресурсы для указанной директории.
		 * @param {String} folder Директория.
		 * @return {FBEditor.resource.Resource[]} Ресурсы.
		 */
		getFolderData: function (folder)
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
		},

		/**
		 * Проверяет тип ресурса.
		 * @param {String} type Mime-тип файла.
		 * @return {Boolean} Допустимый ли тип.
		 */
		checkType: function (type)
		{
			var me = this,
				types = me.types,
				res;

			res = Ext.Array.contains(types, type);

			return res;
		}
	}
);