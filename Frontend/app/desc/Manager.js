/**
 * Менеджер описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.desc.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.desc.Loader'
		],

		/**
		 * @property {String[]|Object[]} Список имен полей редактора текста.
		 */
		editorNames: [
			'annotation',
			'history',
			'preamble'
		],

		/**
		 * @property {Boolean} Идет ли в данный момент процесс загрузки данных в форму.
		 */
		loadingProcess: false,

		/**
		 * @property {String} Id корневого элемента fb3-description.
		 */
		fb3DescId: '',

		/**
		 * @property {Array} Ошибочные поля.
		 */
		fieldsError: [],

		/**
		 * @property {Object} Нужно ли очищать контейнеры с результатами поиска.
		 */
		cleanResultContainer: {},

        /**
         * @private
         * @property {FBEditor.view.form.desc.editor.toolbar.Toolbar} Панель кнопок форматирования редактора текста.
         */
        toolbar: null,

		/**
		 * @private
		 * @property {FBEditor.desc.Loader} Загрузчик описания с хаба.
		 */
		loader: null,

		/**
		 * @private
		 * @property {Boolean} Загружены ли данные в форму.
		 */
		_loadedData: false,

		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;

			// создаем загрузчик
			me.loader = Ext.create('FBEditor.desc.Loader', me);
		},

		/**
		 * Выполняется после рендеринга приложения.
		 */
		launch: function ()
		{
			//
		},

		/**
		 * Сбрасывает описание.
		 */
		reset: function ()
		{
			var me = this,
				loader = me.loader;
			
			me._loadedData = false;
			loader.reset();
		},

        /**
		 * Возвращает тулбар для полей редактоирования текста.
         * @return {FBEditor.view.form.desc.editor.toolbar.Toolbar}
         */
		getToolbar: function ()
		{
			var me = this,
				toolbar = me.toolbar;

            me.toolbar = toolbar || Ext.create('FBEditor.view.form.desc.editor.toolbar.Toolbar');

            return me.toolbar;
        },

		/**
		 * Загружает описание по url.
		 * @param {Number} [art] Айди произведениея на хабе.
		 * @return {Promise}
		 */
		loadFromUrl: function (art)
		{
			var me = this,
				loader = me.loader,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					me.setLoading(art).then(
						function (art)
						{
							// загружаем описание с хаба
							art = art || me.getArtId();

							return loader.load(art);
						}
					).then(
						function (xml)
						{
							var resourceManager = FBEditor.resource.Manager;

							// загружаем данные в форму
							me.loadDataToForm(xml);

							// загружены ли уже ресурсы
							if (!resourceManager.isLoadUrl())
							{
								// загружаем ресурсы
								resourceManager.loadFromUrl(me.getArtId());
							}

							resolve(xml);
						},
						function (response)
						{
							// возникла ошибка

							Ext.log(
								{
									level: 'error',
									msg: 'Ошибка загрузки описания книги',
									dump: response
								}
							);

							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить описание книги',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);

							// убираем информационное сообщение о загрузке
							me.clearLoading();

							reject(response);
						}
					);
				}
			);


			return promise;
		},

		/**
		 * Загружается ли описание отдельно по url.
		 * @return {Boolean}
		 */
		isLoadUrl: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.isLoad();
		},

		/**
		 * Определяет произошла ли заргузка данных.
		 * @return {Boolean} true - загрзука произошла.
		 */
		isLoadedData: function ()
		{
			return this._loadedData;
		},

		/**
		 * Устанавливает произошла ли заргузка.
		 * @param {Boolean} loaded
		 */
		setLoadedData: function (loaded)
		{
			this._loadedData = loaded;
		},

		/**
		 * Сохраняет описание на хабе.
		 */
		saveToUrl: function (resolve, reject)
		{
			var me = this,
				loader = me.loader,
				xml;

			// получаем xml
			xml = me.getXml();

			me.setLoading('Сохранение описания...').then(
				function ()
				{
					return loader.save(xml);
				}
			).then(
				function (xml)
				{
					Ext.log(
						{
							level: 'info', 
							msg: 'Описание сохранено'
						}
					);

					// загружаем полученный с хаба xml в форму
					me.loadDataToForm(xml);

					// убираем информационное сообщение
					me.clearLoading();
					
					resolve();
				},
				function (response)
				{
					var statusOk = 200,
						err;

					err = response.status === statusOk ?
					      response.responseText.match(/(unknown.*?)\n/ig) || response.responseText :
					      response.statusText;
					
					Ext.log(
						{
							level: 'error', 
							msg: 'Ошибка сохранения описания книги', 
							dump: err
						}
					);

					err = Ext.isArray(err) ? '<p>Ошибки:</p>' + err.join('</br></br>') : err;

					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно сохранить описание книги ' + err,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);

					// убираем информационное сообщение
					me.clearLoading();
					
					reject();
				}
			);
		},

		/**
		 * Загружает данные в форму.
		 * @param {String} xml Данные описания в виде строки xml.
		 */
		loadDataToForm: function (xml)
		{
			var me = this,
				converter = FBEditor.converter.desc.Data,
				content = Ext.getCmp('panel-main-content'),
				form = Ext.getCmp('form-desc'),
				editorNames = me.getEditorNames(),
				desc;

			desc = FBEditor.util.xml.Json.xmlToJson(xml);

			if (!desc || !desc['fb3-description'])
			{
				throw Error ('Ошибка в description.xml');
			}

			desc = desc['fb3-description'];
			me.fb3DescId = desc._id;
			desc.xml = xml;

			xml = xml.replace(/[\n\r\t]/g, '');

			// конвертируем данные для формы
			desc = converter.toForm(desc);
			//console.log('desc convert', desc);

			// указываем, что данные вводятся не пользователям, а во время загрузки
			me.loadingProcess = true;

			// создаем контент в полях редактора текста
			Ext.each(
				editorNames,
				function (name)
				{
					var editor,
						data,
						reg;

					// проставляем пространство имен для создания нужного корневого элемента описания
					reg = new RegExp('<' + name + '>(.*?)</' + name + '>');
					data = xml.match(reg);
					data = data ? '<desc:' + name +
					              ' xmlns:desc="http://www.fictionbook.org/FictionBook3/description">' + data[1] +
					              '</desc:' + name + '>' : null;

					if (data)
					{
						// компонент редактора текста
						editor = Ext.getCmp('form-desc-' + name);

						me.createContentEditor(editor, data);
					}
				}
			);

			// отправляем данные в форму описания
			form.fireEvent('loadDesc', desc);

			me.loadingProcess = false;

			if (FBEditor.accessHub)
			{
				// если доступ к хабу есть, то показываем поля поиска
				form.fireEvent('accessHub');
			}
		},

		/**
		 * Создает контент для редактора текста из xml.
		 * @param {FBEditor.view.form.desc.editor.Editor} editor Компонент редактора текста.
		 * @param {String} data Xml-строка.
		 */
		createContentEditor: function (editor, data)
		{
			var me = this,
				promise;

			// создает контент
			function _createContent (editor, data)
			{
				var bodyEditor,
					manager;

				// полноценная xml-строка
				data = '<?xml version="1.0" encoding="UTF-8"?>' + data;

				// редактор текста
				bodyEditor = editor.getBodyEditor();

                //console.log('bodyEditor', bodyEditor);

				// менеджер редактора
				manager = bodyEditor.getManager();

                //console.log('manager', manager);

				// создаем контент редактора из xml-строки
				manager.createContent(data);
			}

			//console.log('editor', editor.rendered);

			if (editor.rendered)
			{
				_createContent(editor, data);
			}
			else
			{
				// данные можно добавить только в отрендеринный компонент
				
				promise = new Promise(
					function (resolve, reject)
					{
						editor.on(
							'afterrender',
							function ()
							{
								resolve();
							}
						);
					}
				);

				promise.then(
					function ()
					{
						_createContent(editor, data);
					}
				);
			}
		},

		/**
		 * Возвращает айди произведения, загружаемого с хаба.
		 * @return {String}
		 */
		getArtId: function ()
		{
			var me = this,
				loader = me.loader;
			
			return loader.getArt();
		},

		/**
		 * Генерирует новый id и передает в функцию-колбэк.
		 * @param options Опции.
		 * @param {Function} options.fn Колбэк-функция, принимающая в качестве парметра новый id.
		 * @param {Object} options.scope Владелец функции fn.
		 */
		getNewId: function (options)
		{
			var me = this,
				total = 10,
				id = [],
				fn = options.fn,
				scope = options.scope,
				url = options.url,
				property = options.property,
				i;

			// генерируем необходимую порцию новых id
			for (i = 0; i < total; i++)
			{
				id.push(me.generateNewId());
			}
			//console.log('id', id);

			// отправляем запрос на получение списка записей соответствущих новым id
			try
			{
				Ext.Ajax.request(
					{
						url: url,
						method: 'GET',
						params: {
							uuid: id.join(',')
						},
						success: function (response)
						{
							var json,
								newId = id[0],
								root;

							try
							{
								json = JSON.parse(response.responseText)
							}
							catch (e)
							{
								Ext.callback(fn, scope, [newId]);
								return;
							}

							root = json[property] || [];
							//console.log('success', root);

							Ext.Array.each(
								id,
							    function (uuid)
							    {
								    var res;

								    // ищем uuid в списке персон
								    res = Ext.Array.findBy(
									    root,
								        function (item)
								        {
									        return item.uuid === uuid;
								        }
								    );

								    if (!res)
								    {
									    // новый uuid найден, заканчиваем поиск

									    newId = uuid;

									    return false;
								    }
							    }
							);

							// колбэк
							Ext.callback(fn, scope, [newId]);
						},
						failure: function ()
						{
							Ext.callback(fn, scope, [id[0]]);
						}
					}
				);
			}
			catch (e)
			{
				Ext.callback(fn, scope, [id[0]]);
			}
		},

		/**
		 * Возвращает список имен полей редактора текста.
		 * @return {String[]}
		 */
		getEditorNames: function ()
		{
			return this.editorNames;
		},

		/**
		 * Возвращает описание в виде строки xml.
		 * @param {Object} [values] Данные формы.
		 * @return {String} Строка xml.
		 */
		getXml: function (values)
		{
			var me = this,
				form = Ext.getCmp('form-desc'),
				xml,
				//xsd,
				data;

			data = values || form.getValues();
			data = {
				'fb3-description': data
			};
			data['fb3-description']._xmlns = 'http://www.fictionbook.org/FictionBook3/description';
			data['fb3-description']._id = me.fb3DescId;
			data['fb3-description']._version = '1.0';
			xml = FBEditor.util.xml.Json.jsonToXml(data);

			// оставляем только разрешенные символы
			xml = xml.replace(me.getRegexpUtf(), '');

			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			console.log('xml desc', xml);

			// проверка xml по схеме отложена на будущее
			/*xsd = FBEditor.xsd.Desc.getXsd();
			 data = {
			 xml: xml,
			 xsd: xsd,
			 xmlFileName: 'description.xml',
			 schemaFileName: 'description.xsd'
			 };
			 valid = FBEditor.util.xml.Jsxml.valid(data);
			 console.log('valid', valid);*/

			return xml;
		},

		/**
		 * Возвращает мета-данные в виде строки xml.
		 * @param {Object} [values] Данные формы.
		 * @resolve {String} Строка xml.
		 * @return {Promise}
		 */
		getMetaXml: function (values)
		{
			var me = this,
				form = Ext.getCmp('form-desc'),
				promise,
				xml,
				data,
				metaData;

			/**
			 * Возвращает авторов.
			 * @param {Array} subjects Список связанных персон.
			 * @return {String} Авторы через запятую.
			 */
			function getCreator(subjects)
			{
				var authors = [];

				Ext.each(
					subjects,
					function (item)
					{
						var subject;

						if (item._link === 'author')
						{
							subject = item.title ? item.title.main : item['last-name'];
							authors.push(subject);
						}
					}
				);

				return authors.join(', ');
			}

			data = values || form.getValues();

			promise = new Promise(
				function (resolve, reject)
				{
                    // получаем номер ревизии
                    me.getNumberRev().then(
                        function (rev)
                        {
                            metaData = {
                                coreProperties: {
                                    __prefix: 'cp',
                                    '_xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
                                    '_xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                                    '_xmlns:dcterms': 'http://purl.org/dc/terms/',
                                    '_xmlns:dcmitype': 'http://purl.org/dc/dcmitype/',
                                    'dc:title': data.title.main,
                                    'dc:creator': getCreator(data['fb3-relations'].subject),
                                    'cp:revision': rev,
                                    'cp:contentStatus': data['fb3-classification']['class'] ?
                                        data['fb3-classification']['class']._contents : '',
                                    'cp:category': data['fb3-classification']['class'] ?
                                        data['fb3-classification']['class'].__text : '',
                                    'dcterms:modified': data['document-info']._updated,
                                    'dcterms:created': data['document-info']._created
                                }
                            };

                            if (data.title && data.title.sub)
                            {
                                metaData.coreProperties['dc:subject'] = data.title.sub;
                            }

                            if (data.annotation)
                            {
                                metaData.coreProperties['dc:description'] = Ext.util.Format.stripTags(data.annotation);
                            }

                            console.log('save meta', metaData);

                            xml = FBEditor.util.xml.Json.jsonToXml(metaData);
                            xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + xml;
                            //console.log(xml);

                            resolve(xml);
                        }
                    );
				}
			);

			return promise;
		},

		/**
		 * Генерирует и возвращает UUID.
		 * @return {String} UUID.
		 */
		generateNewId: function ()
		{
			var id;

			id = Ext.data.identifier.Uuid.Global.generate();

			return id;
		},

		/**
		 * Возвращает регулярное выражение, для всех разрешенных символов utf-8.
		 * @return {RegExp}
		 */
		getRegexpUtf: function ()
		{
			var reg;
			
			reg = FBEditor.ExcludedCompiler.regexpUtf;

			return reg;
		},

		/**
		 * @private
		 * Устанавливает сообщение о загрузке.
		 * @param {String} [msg] Сообщение.
		 * @return {Promise}
		 */
		setLoading: function (msg)
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					var emptyPanel = Ext.getCmp('panel-empty'),
						contentPanel = Ext.getCmp('panel-main-content');

					//console.log('emptyPanel', !emptyPanel || !emptyPanel.rendered);

					// ожидаем пока не будет отрисована пустая панель
					if (!emptyPanel || !emptyPanel.rendered)
					{
						Ext.defer(
							function ()
							{
								resolve(me.setLoading(msg));
							},
							500
						);
					}

					// показываем пустую панель
					contentPanel.fireEvent('contentEmpty');

					msg = msg || 'Загрузка описания...';

					// устанавливаем сообщение
					emptyPanel.setMessage(msg);

					resolve();
				}
			);

			return promise;
		},

		/**
		 * @private
		 * Убирает информационное сообщение о загрузке.
		 */
		clearLoading: function ()
		{
			var contentPanel = Ext.getCmp('panel-main-content');

			// показываем панель описания
			contentPanel.fireEvent('contentDesc');
		},

        /**
		 * @private
		 * Возвращает номер ревизии.
		 * @resolve {Number} Номер ревизии
         * @return {Promise}
         */
		getNumberRev: function ()
		{
			var me = this,
                fileManager = FBEditor.file.Manager,
				promise;

            if (fileManager.fb3file)
            {
                promise = new Promise(
                    function (resolve, reject)
                    {
                        fileManager.fb3file.getStructure().then(
                            function (structure)
                            {
                                return structure.getMeta();
                            }
                        ).then(
                            function (meta)
                            {
                            	var rev;

                                // номер ревизии
                                rev = Number(meta.revision.__text);
                                rev = Ext.isNumber(rev) ? rev + 1 : 1;

                                resolve(rev);
                            }
                        );
                    }
                );
            }
            else
            {
                promise = Promise.resolve(0);
            }

            return promise;
		}
	}
);