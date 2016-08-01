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
			'FBEditor.resource.FolderResource',
			'FBEditor.resource.data.FileData',
			'FBEditor.resource.data.UrlData'
		],

		/**
		 * @property {FBEditor.resource.Resource[]} Ресурсы.
		 */
		data: [],

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
		 * @property {String} Адрес загрузки/сохранения списка ресурсов.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_body_rels/',

		/**
		 * @property {String} Адрес загрузки списка.
		 */
		loadUrl: null,

		/**
		 * @property {String} Адрес сохранения списка.
		 */
		saveUrl: null,

		/**
		 * @private
		 * @property {String} Адрес загрузки/сохранения ресурса.
		 */
		urlRes: 'https://hub.litres.ru/pages/get_fb3_body_image/',

		/**
		 * @private
		 * @property {Number} Айди произведения на хабе.
		 */
		art: null,

		/**
		 * @property {String} Корневая директория ресурсов в архиве.
		 */
		rootPath: 'fb3/img',

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
		 * Загружает список ресурсов из url.
		 * @param {Number} art Айди произведения на хабе.
		 * @param {Function} resolve Функция успеха.
		 */
		loadFromUrl: function (art, resolve)
		{
			var me = this,
				url;

			// формируем url загрузки
			me.art = art;
			url = me.url + '?art=' + me.art;
			me.loadUrl = url;

			Ext.log({level: 'info', msg: 'Загрузка ресурсов из ' + url});

			Ext.Ajax.request(
				{
					url: url,
					scope: me,
					success: function(response)
					{
						this.responseLoad(response, resolve);
					},
					failure: function (response)
					{
						this.responseLoad(response, resolve);
					}
				}
			);
		},

		/**
		 * Загружает данные ресурсов из архива в редактор.
		 * @param {FBEditor.FB3.rels.Image[]} images Изображения, полученные из архива открытой книги.
		 */
		load: function (images)
		{
			var me = this,
				data = [];

			//console.log('images', images);
			Ext.each(
				images,
				function (item)
				{
					var res,
						resData;

					resData = item.getData();
					res = Ext.create('FBEditor.resource.Resource', resData);
					data.push(res);
				}
			);

			//console.log('data', data);
			me.data = data;
			me.sortData();
			me.updateNavigation();
			me.generateFolders();
			me.setActiveFolder('');
		},

		/**
		 * Загружает ресурс из файла.
		 * @param {Object} data Данные ресурса.
		 * @param {ArrayBuffer} data.content Бинарное содержимое файла.
		 * @param {Object} data.file Данные файла.
		 * @param {String} data.file.name Имф файла.
		 * @param {String} data.file.type Тип файла.
		 * @param {String} data.file.size Размер файла.
		 * @param {String} data.file.lastModifiedDate Дата последнего изменения файла.
		 */
		loadResource: function (data)
		{
			var me = this,
				file = data.file,
				res,
				resData;

			if (!me.checkType(file.type))
			{
				throw Error('Недопустимый тип ресурса');
			}

			resData = Ext.create('FBEditor.resource.data.FileData', data);
			resData = resData.getData();

			if (me.containsResource(resData.name))
			{
				throw Error('Ресурс с именем ' + resData.name + ' уже существует');
			}

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
				else if (resource.elements.length)
				{
					Ext.Msg.confirm(
						'Удаление ресурса',
						'Данный ресурс используется в теле книги. Вы уверены, что хотите его удалить?',
						function (btn)
						{
							if (btn === 'yes')
							{
								resource.clearElements();
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
		 * Возвращает данные ресурса по его имени.
		 * @param {String} name Имя ресурса.
		 * @return {FBEditor.resource.Resource} Ресурс.
		 */
		getResourceByName: function (name)
		{
			var me = this,
				data = me.data,
				resourceIndex,
				resource;

			resourceIndex = me.getResourceIndexByName(name);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;

			return resource;
		},

		/**
		 * Возвращает данные ресурса по айди.
		 * @param {String} id Айди ресурса.
		 * @return {FBEditor.resource.Resource} Ресурс.
		 */
		getResourceByFileId: function (id)
		{
			var me = this,
				data = me.data,
				resourceIndex,
				resource;

			resourceIndex = me.getResourceIndexByFileId(id);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;

			return resource;
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
		 * Возвращает индекс ресурса из массива ресурсов.
		 * @param {String} name Имя ресурса.
		 * @return {Number|null} Индекс ресурса.
		 */
		getResourceIndexByName: function (name)
		{
			var me = this,
				data = me.data,
				resourceIndex,
				res;

			res = Ext.Array.findBy(
				data,
				function (item, index)
				{
					resourceIndex = index;

					return item.name === name;
				}
			);
			resourceIndex = res ? resourceIndex : null;

			return resourceIndex;
		},

		/**
		 * @private
		 * Возвращает индекс ресурса из массива ресурсов.
		 * @param {String} id Айди ресурса.
		 * @return {Number|null} Индекс ресурса.
		 */
		getResourceIndexByFileId: function (id)
		{
			var me = this,
				data = me.data,
				resourceIndex,
				res;

			res = Ext.Array.findBy(
				data,
				function (item, index)
				{
					resourceIndex = index;

					return item.fileId === id;
				}
			);
			resourceIndex = res ? resourceIndex : null;

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
		},

		/**
		 * @private
		 * Обработчик ответа на запрос загрузки списка ресурсов с хаба.
		 * @param {Object} response Ответ запроса.
		 * @param {Function} resolve
		 */
		responseLoad: function (response, resolve)
		{
			var me = this,
				url = me.loadUrl,
				xml,
				msg;

			try
			{
				if (response && response.responseText && /^<\?xml/ig.test(response.responseText))
				{
					xml = response.responseText;
					me.loadDataResources(xml, resolve);
				}
				else
				{
					throw Error();
				}
			}
			catch (e)
			{
				msg = ' (' + e + ')';
				Ext.log({level: 'error', msg: 'Ошибка загрузки списка ресурсов',
					        dump: {response: response, error: e}});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Невозможно загрузить список ресурсов по адресу ' + url + msg,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}
		},

		/**
		 * Загружает данные ресурсов.
		 * @param {String} xml Данные ресурсов из загруженного списка rels.
		 */
		loadDataResources: function (xml, resolve)
		{
			var me = this,
				xml2Json = FBEditor.util.xml.Json,
				images = [],
				requestCount = 0,
				json,
				data;

			// переводи xml в json
			json = xml2Json.xmlToJson(xml);
			data = json.Relationships.Relationship;

			Ext.Array.each(
				data,
			    function (item)
			    {
				    var url,
					    id,
					    name;

				    id = item._Id;
				    name = item._Target;

				    // формируем url для загрузки ресурса
				    url = me.urlRes + '?art=' + me.art + '&image=' + id;

				    // загружаем ресурс по url
				    Ext.Ajax.request(
					    {
						    url: url,
						    scope: me,
						    binary: true,
						    success: function(response)
						    {
							    var resource = {},
								    img;

							    // увеличиваем счетчик выполненных запросов
							    requestCount++;

							    // формируем данные файла для ресурса
							    resource.content = response.responseBytes;
							    resource.fileName = name;
							    resource.fileId = id;
							    
							    img = Ext.create('FBEditor.resource.data.UrlData', resource);
							    images.push(img);

							    if (requestCount === data.length)
							    {
								    // загружаем данные в редактор после последнего выполненого запроса
								    me.load(images);
								    resolve();
							    }
						    },
						    failure: function (response)
						    {
							    var msg;

							    // увеличиваем счетчик выполненных запросов
							    requestCount++;

							    msg = ' ' + response.status + ' (' + response.statusText + ')';
							    Ext.log({level: 'error', msg: 'Ошибка загрузки ресурса',
								            dump: {response: response, error: e}});
							    Ext.Msg.show(
								    {
									    title: 'Ошибка',
									    message: 'Невозможно загрузить ресурс по адресу ' + url + msg,
									    buttons: Ext.MessageBox.OK,
									    icon: Ext.MessageBox.ERROR
								    }
							    );

							    if (requestCount === data.length)
							    {
								    // загружаем данные в редактор после последнего выполненого запроса
								    me.load(images);
								    resolve();
							    }
						    }
					    }
				    );
			    }
			);
		}
	}
);