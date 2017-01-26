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
			'FBEditor.resource.FolderResource',
			'FBEditor.resource.Loader',
			'FBEditor.resource.Resource',
			'FBEditor.resource.TreeManager',
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
		 * @private
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
		 * @private
		 * @property {FBEditor.resource.Loader} Загрузчик ресурсов с хаба.
		 */
		loader: null,

		init: function ()
		{
			var me = this;

			// создаем загрузчик
			me.loader = Ext.create('FBEditor.resource.Loader', me);
		},

		/**
		 * Сбрасывает данные ресурсов.
		 */
		reset: function ()
		{
			var me = this;

			me.data = [];
			me.loader.reset();
		},

		/**
		 * Загружает ресурсы с хаба.
		 * @param {Number} [art] Айди произведениея на хабе.
		 */
		loadFromUrl: function (art)
		{
			var me = this,
				loader = me.loader,
				startTime = new Date().getTime();

			art = art || me.getArtId();

			// загружаем список ресурсов
			loader.load(art).then(
				function (xml)
				{
					var xml2Json = FBEditor.util.xml.Json,
						json,
						data;

					// переводим xml в json
					json = xml2Json.xmlToJson(xml);
					data = json.Relationships.Relationship;

					data = data && data.length ? data : [];

					return loader.loadResources(data);
				},
				function (response)
				{
					Ext.log(
						{
							level: 'error',
							msg: 'Ошибка загрузки списка ресурсов',
							dump: response
						}
					);

					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно загрузить список ресурсов',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);
				}
			).then(
				function ()
				{
					// получаем данные обложки
					return loader.getCover();
				}
			).then(
				function (target)
				{
					if (!target)
					{
						/*
						Ext.log(
							{
								level: 'warn',
								msg: 'Не удалось загрузить обложку'
							}
						);

						Ext.Msg.show(
							{
								title: 'Предупреждение',
								message: 'Не удалось загрузить обложку',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.WARNING
							}
						);
						*/
					}
					else 
					{
						Ext.log(
							{
								level: 'info',
								msg: 'Обложка: ' + target
							}
						);

						// устанавливаем обложку, игнорируя хаб
						target = target.replace(/^\//, '');
						me.setCover(target, true);
					}
					
					// создаем папки
					me.generateFolders();
					
					// убираем выделение с папки, если оно было
					me.setActiveFolder('');
					
					// сортируем ресурсы
					me.sortData();

					// обновляем панель ресурсов
					me.updateNavigation();

					Ext.log(
						{
							level: 'info',
							msg: 'Процесс загрузки завершен за ' +
							     Number(new Date().getTime() - startTime) + ' мс'
						}
					);
				}
			);
		},

		/**
		 * Загружаются ли ресурсы отдельно по url.
		 * @return {Boolean}
		 */
		isLoadUrl: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.isLoad();
		},

		/**
		 * Загружает данные ресурсов в редактор.
		 * @param {FBEditor.resource.data.AbstractData[]} resources Данные ресурсов.
		 */
		load: function (resources)
		{
			var me = this,
				data = me.data,
				cover;

			//console.log('resources', resources);
			Ext.each(
				resources,
				function (item)
				{
					var res,
						resData;

					resData = item.getData();
					res = Ext.create('FBEditor.resource.Resource', resData);
					data.push(res);

					if (res.isCover)
					{
						// обложка
						cover = res;
					}
				}
			);

			//console.log('data', data);
			me.data = data;
			me.sortData();
			me.updateNavigation();
			me.generateFolders();
			me.setActiveFolder('');

			if (cover)
			{
				// устанавливаем обложку
				me.setCover(cover.name);
			}
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
				loader = me.loader,
				resData,
				res;

			// проверяем тип ресурса
			if (!me.checkType(file.type))
			{
				throw Error('Недопустимый тип ресурса');
			}

			// создаём данные ресурса
			resData = Ext.create('FBEditor.resource.data.FileData', data);
			resData = resData.getData();

			if (me.containsResource(resData.name))
			{
				throw Error('Ресурс с именем ' + resData.name + ' уже существует');
			}

			if (FBEditor.accessHub && loader.getArt())
			{
				//console.log(resData);
				// сохраняем ресурс на хабе
				me.saveToUrl(resData).then(
					function (xml)
					{
						// синхронизируем ресурсы с хабом
						me.syncResources(xml);
					}
				);
			}
			else
			{
				// создаём объект ресурса
				res = Ext.create('FBEditor.resource.Resource', resData);
				me.data.push(res);

				// сортируем ресурсы
				me.sortData();

				// обновляем дерево навигации
				me.updateNavigation();
			}
		},

		/**
		 * Сохраняет ресурс на хабе.
		 * @param {FBEditor.resource.data.FileData} resData Данные ресурса.
		 * @return {Promise}
		 */
		saveToUrl: function (resData)
		{
			var me = this,
				loader = me.loader,
				promise;
			
			promise = new Promise(
				function (resolve, reject)
				{
					loader.save(resData).then(
						function (xml)
						{
							resolve(xml);
						},
						function (response)
						{
							Ext.log(
								{
									level: 'error',
									msg: 'Ошибка сохранения ресурса на хабе',
									dump: response
								}
							);

							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно сохранить ресурс на хабе',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
							
							reject(response);
						}
					);
				}
			);
			
			return promise;
		},

		/**
		 * Удаляет ресурс на хабе.
		 * @param {String} name Имя ресурса. Если ресурс является папкой, то метод будет взываться рекурсивно до тех
		 * пор пока не будут удалены все русурсы директории
		 */
		deleteFromUrl: function (name)
		{
			var me = this,
				loader = me.loader,
				folderData = [],
				res,
				id;

			res = me.getResourceByName(name);

			if (res && res.isFolder)
			{
				// получаем ресурсы папки
				folderData = me.getFolderData(name);

				Ext.log(
					{
						level: 'info',
						msg: 'Удаляется папка ' + name,
						dump: folderData
					}
				);

				// берем последний ресурс из списка
				res = folderData.length ? folderData.pop() : false;

				if (res && res.isFolder)
				{
					//console.log('res', res.name, me.getFolderData(res.name));

					// удаляем ресурсы в подпапке
					me.deleteFromUrl(res.name);

					return;
				}
			}

			if (!res)
			{
				console.log(name);
				return;
			}

			id = res.fileId;

			loader.remove(id).then(
				function (xml)
				{
					if (folderData.length)
					{
						// удаляем ресурс
						me.deleteResource(res.name);

						// если в папке еще остались ресурсы, то продолжаем их удалять
						me.deleteFromUrl(name);
					}
					else
					{
						// синхронизируем ресурсы с хабом
						me.syncResources(xml);
					}
				},
				function (response)
				{
					Ext.log(
						{
							level: 'error',
							msg: 'Ошибка удаления ресурса',
							dump: response
						}
					);

					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно удалить ресурс',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);
				}
			);
		},

		/**
		 * Синхронизирует ресурсы с хабом.
		 * @param {String} xml Список ресурсов с хаба из body.rels.
		 */
		syncResources: function (xml)
		{
			var me = this,
				loader = me.loader,
				xml2Json = FBEditor.util.xml.Json,
				data = me.data,
				addedData= [],
				removedData = [],
				remoteData,
				json;

			//console.log(xml);

			// переводим xml в json
			json = xml2Json.xmlToJson(xml);
			remoteData = json.Relationships.Relationship;

			Ext.log(
				{
					level: 'info',
					msg: 'Данные ресурсов',
					dump: {'Ресурсы с хаба': remoteData, 'Текущие ресурсы': data}
				}
			);

			// получаем список добавленных ресурсов
			Ext.Array.each(
				remoteData,
			    function (remoteItem)
			    {
				    var contains = false;

				    Ext.Array.each(
					    data,
					    function (item)
					    {
						    if (remoteItem._Id === item.fileId && remoteItem._Target === item.rootName)
						    {
							    contains = true;
							    return false;
						    }
					    },
					    this
				    );

				    if (!contains)
				    {
					    addedData.push(remoteItem);
				    }
			    }
			);

			// получаем список удаленных ресурсов
			Ext.Array.each(
				data,
				function (item)
				{
					var contains = false;

					Ext.Array.each(
						remoteData,
						function (remoteItem)
						{
							if (remoteItem._Id === item.fileId && remoteItem._Target === item.rootName)
							{
								contains = true;
								return false;
							}
						},
						this
					);

					if (!contains && !item.isFolder)
					{
						removedData.push(item);
					}
				}
			);

			Ext.log(
				{
					level: 'info',
					msg: 'Затрагиваемые ресурсы',
					dump: {'Добавить': addedData, 'Удалить': removedData}
				}
			);

			if (addedData.length)
			{
				// загружаем добавленные ресурсы
				loader.loadResources(addedData).then(
					function ()
					{
						me.generateFolders();
						me.sortData();
						me.updateNavigation();

						Ext.log(
							{
								level: 'info',
								msg: 'Добавлены новые ресурсы',
								dump: addedData
							}
						);
					}
				);
			}

			if (removedData.length)
			{
				// удаляем ресурсы
				Ext.Array.each(
					removedData,
				    function (item)
				    {
					    me.deleteResource(item.name);

					    Ext.log(
						    {
							    level: 'info',
							    msg: 'Удалён ресурс ' + item.name,
							    dump: item
						    }
					    );
				    }
				);
			}
		},

		/**
		 * Добавляет в редактор ресурс загруженный с хаба.
		 * @param {Object} data Данные ресурса.
		 */
		addLoadedResource: function (data)
		{
			var me = this,
				editorManager = FBEditor.getEditorManager(),
				urlData,
				res,
				resData;

			// объект данных
			urlData = Ext.create('FBEditor.resource.data.UrlData', data);

			// данные
			resData = urlData.getData();

			//console.log('resData', resData);

			// ресурс
			res = Ext.create('FBEditor.resource.Resource', resData);
			
			me.data.push(res);

			if (res.isCover)
			{
				// устанавливаем обложку
				me.setCover(res.name);
				me.data.pop();
			}
			else
			{
				// связываем изображения в теле книги с загруженным ресурсом
				editorManager.linkImagesToRes(res);
			}
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
			}

			function _deleteFolder (index)
			{
				var name = data[index].name,
					resources = [];

				data.splice(index, 1);

				Ext.each(
					data,
					function (item)
					{
						if (item.name.indexOf(name) !== 0)
						{
							resources.push(item);
						}
					}
				);

				me.data = resources;
			}

			resourceIndex = me.getResourceIndexByName(name);
			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;

			if (!resource)
			{
				console.log('Ресурс ' + name + ' не найден');
				return false;
			}

			if (resource.isFolder)
			{
				if (me.containsCover(resource))
				{
					Ext.getCmp('panel-cover').fireEvent('clear');
					_deleteFolder(resourceIndex);
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
					Ext.getCmp('panel-cover').fireEvent('clear');
					_deleteResource(resourceIndex);
				}
				else if (resource.elements.length)
				{
					resource.clearElements();
					_deleteResource(resourceIndex);
				}
				else
				{
					_deleteResource(resourceIndex);
				}
			}

			me.generateFolders();
			me.sortData();
			me.updateNavigation();

			return result;
		},

		/**
		 * Сохраняет ресурс локально.
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
				loader = me.loader,
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
					
					if (FBEditor.accessHub && loader.getArt())
					{
						// перемещаем ресурс на хабе
						loader.move(resource, newName).then(
							function (xml)
							{
								// синхронизируем ресурсы с хабом
								me.syncResources(xml);
								me.setActiveFolder(newFolder);
							}
						);
					}
					else 
					{
						resource.rename(newName);
						me.setActiveFolder(newFolder);
					}
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
		 * @param {Boolean} [ignoreHub] Игнорировать ли установку обложки на хабе. Иногда это необходимо, так как на
		 * хабе она может быть уже установлена и прилложение об этом знает.
		 */
		setCover: function (coverName, ignoreHub)
		{
			var me = this,
				data = me.data,
				loader = me.loader,
				panel = Ext.getCmp('panel-cover'),
				cover = null,
				oldCover,
				name;

			if (!coverName)
			{
				return false;
			}

			// айди ресурса
			name = coverName.indexOf(me.rootPath) === 0 ? coverName.substring(me.rootPath.length + 1) : coverName;

			// перебираем все ресурсы
			Ext.Array.each(
				data,
			    function (item)
			    {
				    if (item.name === name)
				    {
					    // новая обложка
					    cover = item;
				    }
				    else if (item.isCover)
				    {
					    // старая обложка
					    oldCover = item;
				    }
			    }
			);

			if (cover)
			{
				if (!cover.isCover && FBEditor.accessHub && loader.getArt() && !ignoreHub)
				{
					// устанавливаем обложку на хабе
					loader.setCover(cover).then(
						function (res)
						{
							console.log(res);

							if (oldCover)
							{
								// снимаем с обложки
								oldCover.isCover = false;
							}

							// ставим новую обложку
							cover.isCover = true;
							panel.fireEvent('load', cover);
						},
					    function (res)
					    {
						    var msg = ' ' + res.status + ' (' + res.statusText + ')';

						    Ext.log(
							    {
								    level: 'error',
								    msg: 'Ошибка установки обложки' + msg,
								    dump: res
							    }
						    );

						    Ext.Msg.show(
							    {
								    title: 'Ошибка',
								    message: 'Невозможно установить обложку' + msg,
								    buttons: Ext.MessageBox.OK,
								    icon: Ext.MessageBox.ERROR
							    }
						    );
					    }
					);
				}
				else 
				{
					if (oldCover)
					{
						// снимаем с обложки
						oldCover.isCover = false;
					}

					// ставим новую обложку
					cover.isCover = true;
					panel.fireEvent('load', cover);
				}
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
				cover;

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

			//console.log('getFolderData', folder);

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

				    //console.log('name, lastPart, pos', name, lastPart, pos);

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
				dataWithoutFolders = [],
				folders = [];

			//console.log('generateFolders', data);

			// удаляем все директории перед созданием
			Ext.each(
				data,
			    function (item)
			    {
				    if (!item.isFolder)
				    {
					    dataWithoutFolders.push(item);
				    }
			    }
			);

			data = dataWithoutFolders;

			Ext.each(
				data,
			    function (item, index)
			    {
				    var isContains = false,
					    total,
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

					    //console.log('nameFolder, isContains', nameFolder, isContains);

					    if (!isContains)
					    {
						    // создаем папку с учетом вложенности папок

						    do
						    {
							    // количество ресурсов в папке
							    total = 0;

							    // дата последнего изменения папки
							    modifiedDate = item.modifiedDate;

							    Ext.each(
								    data,
								    function (item)
								    {
									    if (item.name.indexOf(nameFolder) === 0)
									    {
										    total++;

										    if (item.modifiedDate && item.modifiedDate.getTime() > modifiedDate.getTime())
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

							    nameFolder = nameFolder.replace(/(.*)\/.*?$/, '$1');
							    //console.log('nameFolder', nameFolder, baseNameFolder);
						    }
						    while (nameFolder !== baseNameFolder);

					    }
				    }
			    }
			);
			
			if (folders.length)
			{
				data = Ext.Array.merge(folders, data);
			}

			//console.log(data);
			
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
		}
	}
);