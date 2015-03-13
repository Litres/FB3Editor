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
			'FBEditor.resource.ExplorerManager',
			'FBEditor.resource.TreeManager',
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
		 * @property {String} По умолчанию используемая директория обложки относительно директории ресурсов.
		 */
		defaultThumbPath: 'thumb',

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
		activeFolder: '',

		/**
		 * @private
		 * @property {Function} Колбэк-функция, которая должна вызываться при выборе ресурса в окне прводника ресурсов.
		 */
		selectFn: null,

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
						type: item.getType(),
						isCover: item.getIsCover()
					};
					res = Ext.create('FBEditor.resource.Resource', resData);
					data.push(res);
				}
			);
			me.data = data;
			me.sortData();
			me.updateNavigation();
			me.generateFolders();
			me.setActiveFolder('');
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
			name = me.activeFolder + (me.activeFolder ? '/' : '') + file.name;
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
				resource,
				resourceIndex,
				result = true;

			function _deleteResource (index)
			{
				data.splice(index, 1);
				me.updateNavigation();
			}

			function _deleteFolder (index)
			{
				var name = data[index].name,
					resources = [];

				data.splice(index, 1);
				Ext.each(
					data,
					function (item, i)
					{
						if (item.name.indexOf(name) !== 0)
						{
							resources.push(item);
						}
					}
				);
				me.data = resources;
				me.updateNavigation();
			}

			resourceIndex = me.getResourceIndexByName(name);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;
			if (!resource)
			{
				throw Error('Ресурс ' + name + ' не найден');
			}
			if (resource.isFolder)
			{
				if (me.containsCover(resource))
				{
					Ext.Msg.confirm(
						'Удаление папки',
						'Данная папка содержит обложку книги. Вы уверены, что хотите её удалить?',
						function (btn)
						{
							if (btn === 'yes')
							{
								Ext.getCmp('panel-cover').fireEvent('clear');
								_deleteFolder(resourceIndex);
							}
						}
					);
				}
				else
				{
					_deleteFolder(resourceIndex);
				}
			}
			else
			{
				if (resource.isCover)
				{
					Ext.Msg.confirm(
						'Удаление ресурса',
						'Данный ресурс является обложкой книги. Вы уверены, что хотите его удалить?',
						function (btn)
						{
							if (btn === 'yes')
							{
								Ext.getCmp('panel-cover').fireEvent('clear');
								_deleteResource(resourceIndex);
							}
						}
					);
				}
				else
				{
					_deleteResource(resourceIndex);
				}
			}

			return result;
		},

		/**
		 * Сохраняет ресурс.
		 * @param {String} name Имя ресурса.
		 * @return {Boolean} Успешность сохранения.
		 */
		saveResource: function (name)
		{
			var me = this,
				data = me.data,
				resourceIndex,
				resource,
				result;

			resourceIndex = me.getResourceIndexByName(name);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;
			if (!resource)
			{
				throw Error('Ресурс ' + name + ' не найден');
			}
			result = FBEditor.file.Manager.saveResource(resource);

			return result;
		},

		/**
		 * Перемещает ресурс.
		 * @param {String} name Имя ресурса.
		 * @param {String} folder Имя папки, в которую перемещается ресурс.
		 * @return {Boolean} Успешность перемещения.
		 */
		moveResource: function (name, folder)
		{
			var me = this,
				data = me.data,
				newFolder = folder === '/' ? '' : folder,
				resourceIndex,
				resource,
				oldName,
				newName,
				result = false;

			resourceIndex = me.getResourceIndexByName(name);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;
			if (!resource)
			{
				throw Error('Ресурс ' + name + ' не найден');
			}
			if (name === newFolder)
			{
				throw Error('Невозможно переместить ресурс сам в себя');
			}
			oldName = resource.name;
			if (oldName.indexOf(name) === 0)
			{
				newName = oldName.indexOf('/') !== -1 ?
				          oldName.replace(/.*(\/.*?)$/, newFolder + '$1') :
				          newFolder + '/' + oldName;
				newName = newName.replace(/^[/]/, '');
				if (newName !== oldName)
				{
					result = true;
					resource.rename(newName);
					me.setActiveFolder(newFolder);
				}
			}

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
				activeFolder = me.activeFolder,
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
			else
			{
				throw Error('Папка с именем `' + name + '` уже существует');
			}

			return false;
		},

		/**
		 * Устанавливает активную директорию дерева навигации и обновляет отображение ресурсов.
		 * @param {String} folder Директория.
		 */
		setActiveFolder: function (folder)
		{
			var me = this,
				resources,
				bridge = FBEditor.getBridgeWindow();

			me.activeFolder = folder;
			resources = me.getFolderData(folder);

			// заполняем панель отображения ресурсов файлами из выбранной директории
			bridge.Ext.getCmp('view-resources').setStoreData(resources);
		},

		/**
		 * Устанавливает колбэк-функцию, которая должна вызываться при выборе ресурса в окне прводника ресурсов.
		 * @param {Function} fn Функция.
		 */
		setSelectFunction: function (fn)
		{
			this.selectFn = fn;
		},

		/**
		 * Устанавливает колбэк-функцию, которая должна вызываться при выборе обложки в окне проводника ресурсов.
		 */
		setSelectCoverFunction: function ()
		{
			var me = this;

			me.selectFn = function (data)
			{
				Ext.getCmp('window-resource').close();
				me.setCover(data.name);
				me.selectFn = null;
			};
		},

		/**
		 * Устанавливает колбэк-функцию, которая должна вызываться при выборе папки в окне дерева ресурсов.
		 */
		setSelectFolderFunction: function ()
		{
			var me = this;

			me.selectFn = function (data)
			{
				Ext.getCmp('window-resource-tree').setFolder(data.path);
			};
		},

		/**
		 * Устанавливает обложку.
		 * @param {String} coverName Имя обложки.
		 */
		setCover: function (coverName)
		{
			var me = this,
				data = me.data,
				name,
				cover = null;

			if (!coverName)
			{
				return false;
			}
			name = coverName.indexOf(me.rootPath) === 0 ? coverName.substring(me.rootPath.length + 1) : coverName;
			Ext.Array.each(
				data,
			    function (item)
			    {
				    item.isCover = false;
				    if (item.name === name)
				    {
					    cover = item;
				    }
			    }
			);
			if (cover)
			{
				cover.isCover = true;
				Ext.getCmp('panel-cover').fireEvent('load', cover);
			}
		},

		/**
		 * Восстанавливает активную директорию ресурсов.
		 * @param {String} folder Директория.
		 */
		restoreActiveFolder: function (folder)
		{
			var me = this,
				bridgeNavigation = FBEditor.getBridgeNavigation(),
				panelNavigation;

			me.activeFolder = folder;
			panelNavigation = bridgeNavigation.Ext.getCmp('panel-resources-navigation');
			panelNavigation.restoreOpenNode();
		},

		/**
		 * Возвращает активную директорию дерева навигации.
		 * @param {String} folder Директория.
		 */
		getActiveFolder: function (folder)
		{
			return this.activeFolder;
		},

		/**
		 * Возвращает колбэк-функцию, которая должна вызываться при выборе ресурса в окне прводника ресурсов.
		 * @return {Function} Функция.
		 */
		getSelectFunction: function ()
		{
			return this.selectFn;
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
		 * Возвращает данные обложки.
		 * @return {FBEditor.resource.Resource}
		 */
		getCover: function ()
		{
			var me = this,
				data = me.data,
				cover = null;

			cover = Ext.Array.findBy(
				data,
			    function (item)
			    {
				    return item.isCover;
			    }
			);

			return cover;
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
		 * Возвращает данные папок.
		 * @return {FBEditor.resource.Resource[]}
		 */
		getFolders: function ()
		{
			var me = this,
				data = me.data,
				resources = [];

			Ext.each(
				data,
				function (item)
				{
					if (item.isFolder)
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

			//console.log('folder', folder);
			Ext.each(
				data,
			    function (item)
			    {
				    var pos,
					    name = item.name,
					    lastPart,
					    isContains;

				    pos = name.indexOf(f);
				    isContains = pos === 0 ? true : false;
				    lastPart = isContains ? name.substring(f.length + 1) : null;
				    //console.log(name, lastPart, pos);
				    if (isContains && lastPart && lastPart.indexOf('/') === -1 || !f && !lastPart)
				    {
					    dataFolder.push(item);
				    }
			    }
			);

			//console.log(dataFolder);
			return dataFolder;
		},

		/**
		 * Возвращает корневой путь директории обложки, используемый по умолчанию.
		 * @return {String} Корневая директория обложки.
		 */
		getDefaultThumbPath: function ()
		{
			var me = this,
				path;

			path = me.rootPath + (me.defaultThumbPath ? '/' + me.defaultThumbPath : '');

			return path;
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
		 * Проверяет находится ли обложка в директории с ресурсами.
		 * @param {FBEditor.FB3.rels.Thumb} thumb Обложка.
		 * @return {Boolean}
		 */
		checkThumbInResources: function (thumb)
		{
			var me = this,
				result;

			result = thumb.getFileName().indexOf(me.rootPath) === 0 ? true : false;

			return result;
		},

		/**
		 * Обновляет данные в дереве навигации.
		 */
		updateNavigation: function ()
		{
			var me = this,
				bridgeNavigation = FBEditor.getBridgeNavigation(),
				resources;

			resources = me.getData();
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
		},

		/**
		 * @private
		 * Возвращает индекс ресурса из массив ресурсов.
		 * @param {String} name Имя ресурса.
		 * @return {Number|null} Индекс ресурса.
		 */
		getResourceIndexByName: function (name)
		{
			var me = this,
				data = me.data,
				resourceIndex = null;

			Ext.Array.findBy(
				data,
				function (item, index)
				{
					resourceIndex = index;

					return item.name === name;
				}
			);

			return resourceIndex;
		},

		/**
		 * Содержит ли папка ресурс обложки.
		 * @param {FBEditor.resource.FolderResource} folder Ресурс папки.
		 * @return {Boolean} Содержится ли обложка.
		 */
		containsCover: function (folder)
		{
			var me = this,
				data = me.data,
				name = folder.name,
				res;

			res = Ext.Array.findBy(
				data,
			    function (item)
			    {
				    if (item.name.indexOf(name) === 0 && item.isCover)
				    {
					    return true;
				    }
			    }
			);

			return res ? true : false;
		}
	}
);