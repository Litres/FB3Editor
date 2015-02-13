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
			'FBEditor.resource.Resource',
			'FBEditor.resource.FolderResource'
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
					var res,
						name,
						resData;

					name = item.getFileName().substring(me.rootPath.length + 1);
					resData = {
						content: item.getArrayBuffer(),
						url: item.getUrl(),
						name: name,
						baseName: item.getBaseFileName(),
						rootName: item.getFileName(),
						modifiedDate: item.getDate(),
						sizeBytes: item.getSize(),
						type: item.getType()
					};
					res = Ext.create('FBEditor.resource.Resource', resData);
					data.push(res);
				}
			);
			me.data = data;
			me.sortData();
			me.updateNavigation();
			me.generateFolders();
		},

		/**
		 * Загружает ресурс из файла.
		 * @param {Object} data Данные ресурса.
		 */
		loadResource: function (data)
		{
			var me = this,
				file = data.file,
				content = data.content,
				name,
				res,
				resData,
				url,
				blob;

			if (!me.checkType(file.type))
			{
				throw Error('Недопустимый тип ресурса');
			}
			name = me._activeFolder + (me._activeFolder ? '/' : '') + file.name;
			if (me.containsResource(name))
			{
				throw Error('Ресурс с именем ' + name + ' уже существует');
			}
			blob = new Blob([content], {type: file.type});
			url = window.URL.createObjectURL(blob);
			resData = {
				content: content,
				url: url,
				name: name,
				baseName: file.name,
				rootName: me.rootPath + '/' + name,
				modifiedDate: file.lastModifiedDate,
				sizeBytes: file.size,
				type: file.type
			};
			res = Ext.create('FBEditor.resource.Resource', resData);
			me.data.push(res);
			me.sortData();
			me.updateNavigation();
		},

		/**
		 * Удаляет ресурс или папку из редактора.
		 * @param {String} name Имя файла.
		 * @return {Boolean} Успешно ли удален ресурс.
		 */
		deleteResource: function (name)
		{
			var me = this,
				data = me.data,
				newData = [],
				result = false;

			Ext.each(
				data,
				function (item, index)
				{
					if (item.name.indexOf(name) === 0)
					{
						result = item.name === name ? true : result;
					}
					else
					{
						newData.push(item);
					}
				}
			);
			if (!result)
			{
				throw Error('Ресурс ' + name + ' не найден');
			}
			me.data = newData;
			me.updateNavigation();

			return result;
		},

		/**
		 * Создает папку в текущей директории.
		 * @param {String} name Имя папки.
		 * @return {Boolean} Создана ли папка.
		 */
		createFolder: function (name)
		{
			var me = this,
				activeFolder = me._activeFolder,
				nameFolder,
				folderData,
				res;

			nameFolder = activeFolder ? activeFolder + '/' + name : name;
			if (!me.containsResource(nameFolder))
			{
				folderData = {
					name: nameFolder,
					baseName: name,
					modifiedDate: new Date()
				};
				res = Ext.create('FBEditor.resource.FolderResource', folderData);
				me.data.unshift(res);
				me.sortData();
				me.updateNavigation();

				return true;
			}

			return false;
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
		 * Возвращает ресурсы.
		 * @return {FBEditor.resource.Resource[]} Ресурсы.
		 */
		getData: function ()
		{
			return this.data;
		},

		/**
		 * Возвращает данные ресурсов.
		 * @return {FBEditor.resource.Resource[]}
		 */
		getResources: function ()
		{
			var me = this,
				data = me.data,
				resources = [];

			Ext.each(
				data,
				function (item)
				{
					if (!item.isFolder)
					{
						resources.push(item);
					}
				}
			);

			return resources;
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
		},

		/**
		 * Проверяет содержится ли в редакторе ресурс с определенным именем.
		 * @param {String} name Имя ресурса.
		 * @return {Boolean}
		 */
		containsResource: function (name)
		{
			var me = this,
				data = me.data,
				res = false;

			Ext.each(
				data,
			    function (item)
			    {
				    if (item.name === name)
				    {
					    res = true;

					    return false;
				    }
			    }
			);

			return res;
		},

		/**
		 * Обновляет данные в дереве навигации.
		 */
		updateNavigation: function ()
		{
			var me = this,
				bridgeNavigation = FBEditor.getBridgeNavigation(),
				resources;

			resources = me.getResources();
			bridgeNavigation.Ext.getCmp('panel-resources-navigation').loadData(resources);

		},

		/**
		 * @private
		 * Создает директории для их отображения.
		 */
		generateFolders: function ()
		{
			var me = this,
				data = me.data,
				folders = [];

			Ext.each(
				data,
			    function (item, index)
			    {
				    var total = 0,
					    isContains = false,
					    nameFolder,
					    baseNameFolder,
					    folderData,
					    modifiedDate,
					    res;

				    if (item.name.indexOf('/') !== -1)
				    {
					    nameFolder = item.name.replace(/(.*)\/.*?$/, '$1');

					    // проверяем создана ли уже папка
					    Ext.each(
						    folders,
					        function (folder)
					        {
						        if (folder.name === nameFolder)
						        {
							        isContains = true;

							        return false;
						        }
					        }
					    );

					    if (!isContains)
					    {
						    // получаем дату последнего изменения папки
						    modifiedDate = item.modifiedDate;
						    Ext.each(
							    data,
							    function (item)
							    {
								    if (item.name.indexOf(nameFolder) === 0)
								    {
									    total++;
									    if (item.modifiedDate.getTime() > modifiedDate.getTime())
									    {
										    modifiedDate = item.modifiedDate;
									    }
								    }
							    }
						    );

						    baseNameFolder = nameFolder.replace(/.*\/(.*?)$/, '$1');
						    folderData = {
							    name: nameFolder,
							    baseName: baseNameFolder,
							    modifiedDate: modifiedDate,
							    total: total
						    };
						    res = Ext.create('FBEditor.resource.FolderResource', folderData);
						    folders.push(res);
					    }
				    }
			    }
			);
			if (folders.length)
			{
				data = Ext.Array.merge(folders, data);
			}
			me.data = data;
		},

		/**
		 * @private
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
					var res;

					res = a.isFolder && b.isFolder && a.name > b.name || !a.isFolder && !b.isFolder && a.name > b.name;

					return res;
				}
			);
			me.data = data;
		}
	}
);