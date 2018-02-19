/**
 * Менеджер файлов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.file.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.file.File',
			'FBEditor.file.Zip',
			'FBEditor.FB3.File',
		    'FBEditor.FB3.Structure',
		    'FBEditor.converter.contentTypes.Data'
		],

		/**
		 * @property {FBEditor.FB3.File} Распакованный файл FB3.
		 */
		fb3file: null,

		/**
		 * @private
		 * @property {String} Имя новой книги по умолчанию.
		 */
		defaultFb3FileName: 'Новая книга',

		/**
		 * Открывает файл FB3.
		 * @param {Object} evt Событие открытие файла.
		 * @return {Boolean} Успешно ли открытие.
		 */
		openFB3: function (evt)
		{
			var me = this,
				file = me.getFileFromEvent(evt),
				result = false;

			if (file)
			{
				result = file.read(
					{
						type: file.LOAD_TYPE_ARRAYBUFFER,
						load: function (data)
						{
							var fileName;

							try
							{
                                // создаем модель файла fb3
								me.fb3file = Ext.create('FBEditor.FB3.File', {file: file.file, content: data});

								// получаем имя файла
                                fileName = me.fb3file.getName();

                                // получаем структуру файла
                                me.fb3file.getStructure().then(
                                	function (structure)
									{
                                        var resourceManager = FBEditor.resource.Manager,
                                            descManager = FBEditor.desc.Manager,
                                            routeManager = FBEditor.route.Manager,
                                            navigationPanel,
                                            contentPanel,
											namePanel,
                                            localBooks,
                                            localDesc,
                                            localBodies,
                                            localImages,
                                            localThumb;

                                        // панель редактора контента
                                        contentPanel = Ext.getCmp('panel-main-content');

                                        // панель навигации
                                        navigationPanel = Ext.getCmp('panel-treenavigation');

                                        // убираем выделение c панели навигации
                                        navigationPanel.fireEvent('clearSelection');

                                        // удаляем параметры из хэша URL,
										// которые предназначались для загрузки книги с хаба
                                        routeManager.removeParams(['art', 'body_art']);

                                        // показываем редактор описания на тот случай, если он еще не был зарендерин
                                        contentPanel.fireEvent('contentDesc');

                                        // панель названия книги
                                        namePanel = Ext.getCmp('panel-filename');

                                        // устанавливаем название книги
                                        namePanel.fireEvent('setName', fileName);

                                        // замораживаем отрисовку
                                        Ext.suspendLayouts();

                                        // получаем список книг
                                        structure.getBooks().then(
                                        	function (books)
											{
                                                // сохраняем в локальную переменную для последующего использования
                                                localBooks = books;

                                                //console.log('books', books);

												// получаем описание
												return structure.getDesc(books[0]);
											}
										).then(
                                        	function (desc) {
                                                // сохраняем в локальную переменную для последующего использования
                                                localDesc = desc;

                                                //console.log('desc', desc);

                                                // сбрасываем форму описания
                                                descManager.reset();

                                                // загружаем описание в форму
                                                descManager.loadDataToForm(desc);

                                                // получаем список тел
                                                return structure.getBodies(localBooks[0]);
                                            }
                                        ).then(
                                            function (bodies) {
                                                // сохраняем в локальную переменную для последующего использования
                                                localBodies = bodies;

                                                //console.log('bodies', bodies);

                                                // получаем ресурсы
                                                return structure.getImages(localBodies[0]);
											}
										).then(
											function (images)
											{
												// сохраняем в локальную переменную для последующего использования
												localImages = images;

                                                //console.log('images', images);

												// получаем обложку
												return structure.getThumb();
											}
										).then(
											function (thumb)
											{
												// сохраняем в локальную переменную для последующего использования
                                                localThumb = thumb;

                                                if (thumb && !resourceManager.checkThumbInResources(thumb))
                                                {
                                                    // если обложка находится не в директории ресурсов,
                                                    // то перемещаем ее туда
                                                    thumb.moveTo(resourceManager.getDefaultThumbPath());

                                                    localImages.push(thumb);
                                                }

                                                // сбрасываем ресурсы
                                                resourceManager.reset();

                                                // загружаем ресурсы
                                                return resourceManager.load(localImages);
											}
										).then(
                                            function ()
                                            {
                                                if (localThumb)
                                                {
                                                    // устанавливаем обложку
                                                    resourceManager.setCover(localThumb.getFileName());
                                                }

                                                // получаем xml тела книги
                                                return structure.getContent(localBodies[0]);
                                            }
                                        ).then(
                                            function (contentBody) {
                                                var bodyNavigationPanel,
													bodyManager;

                                                // редактор тела книги
                                                bodyManager = FBEditor.getEditorManager();

                                                // сбрасываем
                                                bodyManager.reset();

                                                // переключаем контекст на редактор тела книги
                                                contentPanel.openBody();

                                                // создаем контент тела книги
                                                bodyManager.createContent(contentBody);

                                                // дерево текста
                                                bodyNavigationPanel = Ext.getCmp('panel-body-navigation');

                                                // фокус на дерево текста
                                                bodyNavigationPanel.selectRoot();

                                                // размораживаем отрисовку
                                                Ext.resumeLayouts(true);
                                            }
                                        ).catch(
                                        	function (e)
											{
                                                Ext.log(
                                                    {
                                                        level: 'error',
                                                        msg: e,
                                                        dump: e
                                                    }
                                                );
                                                Ext.Msg.show(
                                                    {
                                                        title: 'Ошибка',
                                                        message: 'Невозможно открыть книгу (' + e.message + ')',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    }
                                                );

                                                Ext.resumeLayouts(true);
											}
										);


                                        /*
                                        structure.getContentTypes().then(
                                        	function (contentTypes)
											{
												var converter = FBEditor.converter.contentTypes.Data;

                                                contentTypes = converter.toNormalize(contentTypes);
											}
										);
										*/


                                        //meta = structure.getMeta();

                                        //books = structure.getBooks();

										/*
                                        structure.getBodies(books[0]).then(
                                        	function (bodies)
											{
												return bodies;
											}
										);
										*/

                                        //images = structure.getImages(bodies[0]);

                                        //contentBody = structure.getContent(bodies[0]);

										/*
                                        if (thumb && !resourceManager.checkThumbInResources(thumb))
                                        {
                                            // если обложка находится не в директории ресурсов, то перемещаем ее туда
                                            thumb.moveTo(resourceManager.getDefaultThumbPath());
                                            images.push(thumb);
                                        }
                                        */

										/*
                                        resourceManager.reset();

                                        // загружаем ресурсы
                                        resourceManager.load(images).then(
                                            function ()
                                            {
                                                if (thumb)
                                                {
                                                    // обложка
                                                    resourceManager.setCover(thumb.getFileName());
                                                }

                                                // редактор тела книги
                                                bodyManager = FBEditor.getEditorManager();
                                                bodyManager.reset();

                                                // переключаем контекст на редактор тела книги
                                                content.openBody();

                                                // создаем контент тела книги
                                                bodyManager.createContent(contentBody);
                                            }
                                        );
                                        */
									}
								);
							}
							catch (e)
							{
								Ext.log(
									{
										level: 'error',
										msg: e,
										dump: e
									}
								);
								Ext.Msg.show(
									{
										title: 'Ошибка',
										message: 'Невозможно открыть книгу (' + e.message + ')',
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									}
								);

                                Ext.resumeLayouts(true);
							}
						}
					}
				);
			}

			return result;
		},

		/**
		 * Открывает файл ресурса.
		 * @param {Object} evt Событие открытие файла.
		 * @return {Promise|Boolean}
		 */
		openResource: function (evt)
		{
			var me = this,
				file = me.getFileFromEvent(evt),
				promise = false;

			if (file)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        file.read(
                            {
                                type: file.LOAD_TYPE_ARRAYBUFFER,
                                load: function (data)
                                {
                                	resolve({file: file.file, content: data});
                                }
                            }
                        );
					}
				);
			}

			return promise;
		},

		/**
		 * Возвращает объект файла считанного из события открытия файла.
		 * @param {Object} evt Событие открытие файла.
		 * @return {FBEditor.file.File} Открытый файл.
		 */
		getFileFromEvent: function (evt)
		{
			var file;

			file = evt.target.files.length ? Ext.create('FBEditor.file.File', evt.target.files[0]) : null;

			return file;
		},

		/**
		 * Сохраняет книгу FB3 в файле.
		 * @param {Object} data Данные книги.
		 * @param {Function} fn Функция обратного вызова.
		 */
		saveFB3: function (data, fn)
		{
			var me = this,
				fb3file = me.fb3file,
				fileName,
				fs;

			if (fb3file)
			{
				fb3file.updateStructure(data);
			}
			else
			{
				fb3file = Ext.create('FBEditor.FB3.File', data);
				fb3file.createStructure();
			}

			me.fb3file = fb3file;

			fb3file.generateBlob().then(
				function (blob)
				{
                    fileName = Ext.getCmp('panel-filename-display').getValue() + '.fb3';
                    fs = window.saveAs(blob, fileName);

                    // данные функции должны быть реализованы в будущих браузерах, пока же они не выполняются
                    fs.onwriteend = fn;
                    fs.onabort = fn;
				}
			);
		},

		/**
		 * Сохраняет ресурс в файле.
		 * @param {FBEditor.resource.Resource} resource Данные ресурса.
		 * @param {Function} [fn] Функция обратного вызова.
		 * @return {Boolean} Вызвано ли окно сохранения.
		 */
		saveResource: function (resource, fn)
		{
			var blob,
				fs;

			blob = resource.blob || new Blob([resource.content], {type: resource.type});
			fs = window.saveAs(blob, resource.baseName);
			
			if (fn)
			{
				// данные функции должны быть реализованы в будущих браузерах, пока же они не выполняются
				fs.onwriteend = fn;
				fs.onabort = fn;
			}

			return fs ? true : false;
		}
	}
);