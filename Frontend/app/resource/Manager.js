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
			'FBEditor.resource.ExternalResource',
			'FBEditor.resource.FolderResource',
			'FBEditor.resource.Loader',
			'FBEditor.resource.Paste',
			'FBEditor.resource.Resource',
			'FBEditor.resource.TreeManager',
			'FBEditor.resource.data.ExternalData',
			'FBEditor.resource.data.FileData',
			'FBEditor.resource.data.PasteData',
			'FBEditor.resource.data.UrlData',
			'FBEditor.resource.replacer.Window'
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
		rootPath: '/fb3/img',

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

		/**
		 * @private
		 * @property {FBEditor.resource.Paste} Объект для управления ресурсами, вставляемыми из буфера.
		 */
		paste: null,

        /**
		 * @private
		 * @property {FBEditor.resource.replacer.Window} Окно выбора действий для уже имеющегося ресурса
		 * во время его загрузки.
         */
		replacer: null,

		init: function ()
		{
			var me = this;

			// создаем загрузчик
			me.loader = Ext.create('FBEditor.resource.Loader', me);

			// создаем объект для управления ресурсами, вставляемыми из буфера
			me.paste = Ext.create('FBEditor.resource.Paste', me);
		},

		/**
		 * Возвращает загрузчки.
		 * @return {FBEditor.resource.Loader}
		 */
		getLoader: function ()
		{
			return this.loader;
		},

		/**
		 * Возвращает объект для управления ресурсами, вставляемыми из буфера.
		 * @return {FBEditor.resource.Paste}
		 */
		getPaste: function ()
		{
			return this.paste;
		},

        /**
		 * Возвращает окно выбора действий для уже имеющегося ресурса во время его загрузки.
		 * @param {Object} resData Данные ресурса.
         */
        getReplacer: function (resData)
		{
			var me = this,
				replacer = me.replacer,
				data = Ext.clone(resData);

			if (replacer)
			{
                replacer.setResourceData(data);
			}
			else
			{
				replacer = Ext.create('FBEditor.resource.replacer.Window', data);
                me.replacer = replacer;
            }

			return replacer;
		},

		/**
		 * Сбрасывает данные ресурсов.
		 */
		reset: function ()
		{
			var me = this;

			me.data = [];
			me.loader.reset();
			me.paste.reset();
		},

		/**
		 * Добавляет ресурс в коллекцию.
		 * @param {FBEditor.resource.Resource} res Ресурс.
		 */
		addResource: function (res)
		{
			var me = this;
			
			me.data.push(res);
		},

		/**
		 * Загружает ресурсы с хаба.
		 * @param {Number} [art] Айди произведениея на хабе.
		 * @return {Promise}
		 */
		loadFromUrl: function (art)
		{
			var me = this,
				loader = me.loader,
				startTime = new Date().getTime(),
				promise;

			art = art || me.getArtId();

			promise = new Promise(
				function (resolve, reject)
				{
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

							resolve();
						}
					);
				}
			);

			return promise;
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
		 * Загружает ресурсы в редактор.
		 * @param {FBEditor.resource.data.AbstractData[]|FBEditor.resource.Resource[]} resources Данные ресурсов.
		 */
		load: function (resources)
		{
			var me = this,
				res,
				resData,
				promise;

			function loadRes (resource, resources)
			{
				var pr;

				pr = new Promise(
					function (resolve, reject)
					{
                        resource.load().then(
                            function ()
                            {
                                me.addResource(resource);

                                //console.log('res', resource);

                                if (resource.isCover)
                                {
                                    // устанавливаем обложку
                                    me.setCover(resource.name);
                                }

                                // обновляем элементы
                                resource.updateElements();

                                if (resources.length)
                                {
                                    // продолжаем грузить ресурсы
                                    me.load(resources).then(
                                        function ()
                                        {
                                            resolve();
                                        }
                                    );
                                }
                                else
                                {
                                    // все ресурсы загружены

                                    //console.log('data', me.data);
                                    me.sortData();
                                    me.updateNavigation();
                                    me.generateFolders();
                                    me.setActiveFolder('');

                                    resolve();
                                }
                            }
                        );
					}
				);

				return pr;
			}

			if (!resources)
			{
				return Promise.resolve(null);
			}

			resources = Ext.isArray(resources) ? resources : [resources];
			resData = resources.pop();

			promise = new Promise(
				function (resolve, reject)
				{
					if (resData.getData)
					{
						resData.getData().then(
                            function (data)
                            {
                                res = Ext.create('FBEditor.resource.Resource', data);

                                loadRes(res, resources).then(
                                	function ()
									{
										resolve();
									}
								);
                            }
                        );
                    }
                    else
					{
						res = resData;

                        loadRes(res, resources).then(
                            function ()
                            {
                                resolve();
                            }
                        );
					}

					/*
					res.load().then(
						function ()
						{
							me.addResource(res);

							//console.log('res', res);

							if (res.isCover)
							{
								// устанавливаем обложку
								me.setCover(res.name);
							}

							// обновляем элементы
							res.updateElements();

							if (resources.length)
							{
								// продолжаем грузить ресурсы
								me.load(resources).then(
									function ()
									{
										resolve();
									}
								);
							}
							else
							{
								// все ресурсы загружены

								//console.log('data', me.data);
								me.sortData();
								me.updateNavigation();
								me.generateFolders();
								me.setActiveFolder('');

								resolve();
							}
						}
					);
					*/
				}
			);

			return promise;
		},

		/**
		 * Загружает ресурс из файла.
		 * @param {Object} data Данные ресурса.
		 * @param {ArrayBuffer} data.content Бинарное содержимое файла.
		 * @param {Object} data.file Данные файла.
		 * @param {String} data.file.name Имя файла.
		 * @param {String} data.file.type Тип файла.
		 * @param {String} data.file.size Размер файла.
		 * @param {String} data.file.lastModifiedDate Дата последнего изменения файла.
		 */
		loadResource: function (data)
		{
			var me = this,
				file = data.file,
				loader = me.loader,
				replacer,
				resData,
				res;

			// проверяем тип ресурса
			if (file && !me.checkType(file.type))
			{
				throw Error('Недопустимый тип ресурса');
			}

			// создаём данные ресурса
			resData = data.getData ? data : Ext.create('FBEditor.resource.data.FileData', data);
			resData = resData.getData();

			if (me.containsResource(resData.name))
			{
				// окно выбора действий в случае уже существующего ресурса
				replacer = me.getReplacer(resData);
				replacer.show();

				return;
			}

            me.createResource(resData);
		},

        /**
         * Заменяет существующий ресурс на новый из файла, сохраняя все связанные ссылки.
		 * @param {String} nameResource Имя существующего ресурса.
         * @param {Object} data Данные ресурса.
         * @param {ArrayBuffer} data.content Бинарное содержимое файла.
         * @param {Object} data.file Данные файла.
         * @param {String} data.file.name Имя файла.
         * @param {String} data.file.type Тип файла.
         * @param {String} data.file.size Размер файла.
         * @param {String} data.file.lastModifiedDate Дата последнего изменения файла.
         */
        reloadResource: function (nameResource, data)
        {
            var me = this,
                file = data.file,
                loader = me.loader,
				elements,
				id,
                resData,
                res;

            // проверяем тип ресурса
            if (file && !me.checkType(file.type))
            {
                throw Error('Недопустимый тип ресурса');
            }

            // существующий ресурс
            res = me.getResource(nameResource);

            // создаём данные ресурса
            resData = data.getData ? data : Ext.create('FBEditor.resource.data.FileData', data);
            resData = resData.getData();

            if (FBEditor.accessHub && loader.getArt())
            {
                id = res.fileId;
                elements = res.getElements();

                // удаляем имеющийся ресурс
                loader.remove(id).then(
                    function (xml) {
                        // сохраняем ресурс на хабе
                        return me.saveToUrl(resData);
                    },
                    function (response) {
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
                ).then(
                    function (xml) {
                        // синхронизируем ресурсы с хабом
                        me.syncResources(xml).then(
                        	function (addedData)
							{
								// новый ресурс
                                res = me.getResource(resData.name);

                                // связываем со старыми элементами
                                res.setElements(elements);

                                // обновляем
                                res.updateElements();
							}
						);
                    }
                );
            }
            else
            {
                // обновляем изображение текущего ресурса
                res.updateData(resData);

                me.sortData();
                me.updateNavigation();
                me.updatePanelResources();
            }
        },

        /**
		 * Создает новый ресурс.
         * @param {Object} resData Данные ресурса.
         */
		createResource: function (resData)
		{
            var me = this,
                loader = me.loader,
                res;

            if (FBEditor.accessHub && loader.getArt())
            {
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
                // создаём ресурс
                res = Ext.create('FBEditor.resource.Resource', resData);
                me.addResource(res);

                // сортируем ресурсы
                me.sortData();

                // обновляем дерево навигации
                me.updateNavigation();
            }
		},

		/**
		 * Сохраняет ресурс на хабе.
		 * @param {Object} resData Данные ресурса.
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

			res = me.getResource(name);

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
				promise,
				remoteData,
				json;

			promise = Promise.resolve(true);

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
						    if (remoteItem._Target === item.rootName)
						    {
							    item.fileId = remoteItem._Id;
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
							if (remoteItem._Target === item.rootName)
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
				promise = new Promise(
					function (resolve, reject)
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

                                resolve(addedData);
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

			return promise;
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
			me.addResource(res);

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
		 * @param {FBEditor.resource.Resource|String} resource Ресурс или его имя.
		 * @return {Boolean} Успешно ли удален ресурс.
		 */
		deleteResource: function (resource)
		{
			var me = this,
				data = me.data,
				result = true,
				name,
				resourceIndex;

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

			if (Ext.isString(resource))
			{
				// получаем ресурс по его имени
				resourceIndex = me.getResourceIndexByProp('name', resource);
				resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
				resource = resource && resource[0] ? resource[0] : null;
			}
			else
			{
                resourceIndex = me.getResourceIndexByProp('name', resource.name);
            }

			if (!resource)
			{
				name = resource ? resource.name : resource;
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

            me.updatePanelResources();
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

			resourceIndex = me.getResourceIndexByProp('name', name);
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

			resourceIndex = me.getResourceIndexByProp('name', name);
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
		 * Заменяет имеющийся ресурс на новый.
         * @param {Object} resData Данные ресурса.
         */
        replaceResource: function (resData)
		{
			var me = this,
				loader = me.loader,
				res,
				id;

            // ресурс
            res = Ext.create('FBEditor.resource.Resource', resData);

            if (FBEditor.accessHub && loader.getArt())
            {
                id = res.fileId;

                // удаляем имеющийся ресурс
                loader.remove(id).then(
                    function (xml)
                    {
                        // сохраняем ресурс на хабе
                        return me.saveToUrl(resData);
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
                ).then(
                    function (xml)
                    {
                        // синхронизируем ресурсы с хабом
                        me.syncResources(xml);
                    }
                );
            }
            else
            {
				// удаляем имеющийся ресурс
				me.deleteResource(res);

                // новый ресурс
                res = Ext.create('FBEditor.resource.Resource', resData);

				// добавляем новый
                me.addResource(res);
            }
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
		 * хабе она может быть уже установлена и приложение об этом знает.
		 */
		setCover: function (coverName, ignoreHub)
		{
			var me = this,
				data = me.data,
				loader = me.loader,
				panel = Ext.getCmp('panel-cover'),
				cover = null,
				reg,
				oldCover,
				name;

			if (!coverName)
			{
				return false;
			}

			reg = new RegExp('^' + me.rootPath);
			name = /^\//.test(coverName) || !reg.test('/' + coverName) ? coverName : '/' + coverName;

			// имя ресурса
			name = name.indexOf(me.rootPath) === 0 ? name.substring(me.rootPath.length + 1) : name;

			//console.log('coverName', coverName, me.rootPath, name);

			// перебираем все ресурсы
			Ext.Array.each(
				data,
			    function (item)
			    {
				    //console.log(item.name, item.isCover);

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

			//console.log('cover', cover);

			if (cover)
			{
				if (!cover.isCover && FBEditor.accessHub && loader.getArt() && !ignoreHub)
				{
					// устанавливаем обложку на хабе
					loader.setCover(cover).then(
						function (res)
						{
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
		 * Возвращает данные ресурса по его признаку.
		 * @param {String} search Признак ресурса, по которому он ищется (путь, айди, имя).
		 * @return {FBEditor.resource.Resource} Ресурс.
		 */
		getResource: function (search)
		{
			var me = this,
				data = me.data,
				resource,
				resourceIndex;

			//console.log('getResource', data, search);

			// ищем индекс
			resourceIndex = me.getResourceIndexByProp('fileId', search);
			resourceIndex = resourceIndex === null ? me.getResourceIndexByProp('url', search) : resourceIndex;
			resourceIndex = resourceIndex === null ? me.getResourceIndexByProp('name', search) : resourceIndex;

			//console.log(resourceIndex);

			resource = resourceIndex !== null ? data.slice(resourceIndex, resourceIndex + 1) : null;
			resource = resource && resource[0] ? resource[0] : null;

			return resource;
		},

        /**
		 * Возвращает новое имя ресурса для уже существующего.
         * @param {String} oldName Имя ресурса.
		 * @return {String} Новое имя ресурса.
         */
        getNewResourceName: function (oldName)
		{
			var me = this,
				counter = 1,
				name,
				res;

			do
			{
				name = oldName.replace(/(\.\w+)$/ig, '_' + counter + '$1');
                res = me.getResource(name);
                counter++;
            }
            while (res);

			return name;
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
				name,
				result;

			name = thumb.getFileName();
			result = name.indexOf(me.rootPath) === 0 ? true : false;

			//console.log('checkThumbInResources', name, me.rootPath, result);
			//console.log(thumb);

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

			if (bridgeNavigation.Ext.getCmp && bridgeNavigation.Ext.getCmp('panel-resources-navigation'))
			{
				resources = me.getData();
				bridgeNavigation.Ext.getCmp('panel-resources-navigation').loadData(resources);
			}
			else
			{
				Ext.defer(
					function ()
					{
						this.updateNavigation();
					},
				    100,
				    me
				);
			}
		},

        /**
		 * Обновляет панель свойств ресурсов.
		 * @param {Ext.data.Model} [data] Данные панели свойств. Если данные не переданы, то панель будет чистой.
         */
        updatePanelResources: function (data)
		{
            var me = this,
                bridgeProps = FBEditor.getBridgeProps(),
                panelResources;

            panelResources = bridgeProps.Ext.getCmp('panel-props-resources');
            panelResources.fireEvent('loadData', data);
		},

        /**
         * Вставляет в xml данные всех изображений в виде base64.
         * @param {String} xml Исходный xml.
		 * @return {String} Преобразованный xml.
         */
        convertImgToBase64: function (xml)
        {
            var me = this,
				images,
				newXml;

            newXml = xml;

            // получаем все изображения из xml
            images = newXml.match(/<img(.*?)>/ig);
            //console.log('images', images);

            Ext.each(
                images,
                function (item)
                {
                    var img,
                        src,
                        res,
                        reg;

                    img = item.match(/src="(.*?)"/i);
                    src = img[1];
                    //console.log(src);

                    // ресурс
                    res = me.getResource(src);
                    //console.log(res);

                    reg = new RegExp('<img src="' + src + '"', 'ig');

                    // заменяем данные
                    newXml = newXml.replace(reg, '<img src="' + res.base64 + '" id="' + res.fileId + '"');
                }
            );

			return newXml;
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
		 * Возвращает индекс ресурса из массива ресурсов по одному из его свойств.
		 * @param {String} name Имя свойства ресурса.
		 * @param {String} val Значение свойства ресурса.
		 * @return {Number|null} Индекс ресурса.
		 */
		getResourceIndexByProp: function (name, val)
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

					return item[name] ? item[name] === val : false;
				}
			);

			resourceIndex = res ? resourceIndex : null;

			return resourceIndex;
		}
	}
);