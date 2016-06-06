/**
 * Менеджер описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.desc.Manager',
	{
		singleton: true,

		/**
		 * @property {String} Адрес загрузки/сохранения описания.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_meta/',

		/**
		 * @property {String[]} Список имен полей редактора текста.
		 */
		editorNames: [
			'annotation',
			'biblio-description',
			'history',
			'preamble'
		],

		/**
		 * @property {String} Адрес загрузки описания.
		 */
		loadUrl: null,

		/**
		 * @property {String} Адрес сохранения описания.
		 */
		saveUrl: null,

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

		init: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				params;

			params = routeManager.getParams();

			if (params.art)
			{
				me.loadUrl = me.url + '?art=' + params.art;
			}
			else if (params.desc)
			{
				// запоминаем url загрузки описания
				me.loadUrl = params.desc;
			}
			else if (params.desc === null)
			{
				// признак первоначальной загрузки страницы описания
				me.loadUrl = 'undefined';
			}

			me.saveUrl = params.save_desc || me.url || null;
		},

		/**
		 * Выполняется после рендеринга приложения.
		 */
		launch: function ()
		{
			var me = this;

			if (me.isLoadUrl())
			{
				me.loadFromUrl(me.loadUrl);
			}
		},

		/**
		 * Загружает описание из url.
		 */
		loadFromUrl: function (url)
		{
			var me = this,
				bridge = FBEditor.getBridgeProps(),
				btn;

			// загружена ли пустая панель
			if (!Ext.getCmp('panel-empty') || !Ext.getCmp('panel-empty').rendered)
			{
				Ext.defer(
					function ()
					{
						me.loadFromUrl(url);
					},
					500
				);
			}

			me.loadUrl = url;
			Ext.log({level: 'info', msg: 'Загрузка описания из ' + url});

			try
			{
				btn = bridge.Ext.getCmp('button-desc-load');
				btn.disable();
			}
			catch (e)
			{
				// кнопка загрузки пока еще не рендерилась
			}

			Ext.Ajax.request(
				{
					url: url,
					success: function(response)
					{
						var xml,
							msg;

						if (btn)
						{
							btn.enable();
						}

						try
						{
							if (response && response.responseText)
							{
								xml = response.responseText;
								me.loadDataToForm(xml);
							}
							else
							{
								throw Error();
							}
						}
						catch (e)
						{
							msg = ' (' + e + ')';
							Ext.log({level: 'error', msg: 'Ошибка загрузки описания книги',
								dump: {response: response, error: e}});
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить описание книги по адресу ' + url + msg,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
						}
					},
					failure: function (response)
					{
						var xml,
							msg;

						btn.enable();

						try
						{
							if (response && response.responseText)
							{
								xml = response.responseText;
								me.loadDataToForm(xml);
							}
							else
							{
								throw Error();
							}
						}
						catch (e)
						{
							msg = ' (' + e + ')';
							Ext.log({level: 'error', msg: 'Ошибка загрузки описания книги',
								dump: {response: response, error: e}});
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить описание книги по адресу ' + url + msg,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
						}
					}
				}
			);
		},

		/**
		 * Отправляет xml по адресу url.
		 * @param {String} url Адрес сохранения описания.
		 */
		saveToUrl: function (url)
		{
			var me = this,
				//bridge = FBEditor.getBridgeProps(),
				btn = Ext.getCmp('panel-toolstab-file-button-savedesc'),
				//field = bridge.Ext.getCmp('panel-props-desc').getSaveField(),
				routeManager = FBEditor.route.Manager,
				xml,
				art;

			art = routeManager.getParams().art;

			if (art)
			{
				xml = me.getXml();
				Ext.log({level: 'info', msg: 'Сохранение описания в ' + url});
				btn.disable();
				//field.disable();

				try
				{
					Ext.Ajax.request(
						{
							url: url,
							params: {
								action: 'update_hub_on_fb3_meta',
								fb3_meta: xml,
								art: art
							},
							disableCaching: true,
							success: function (response)
							{
								var errMsg,
									xmlResponse;

								btn.enable();
								//field.enable();

								if (response.responseXML)
								{
									Ext.log({level: 'info', msg: 'Описание сохранено'});
									xmlResponse = response.responseText;
									me.loadDataToForm(xmlResponse);
								}
								else
								{
									errMsg = response.responseText.match(/(unknown.*?)\n/ig);
									//console.log(errMsg);

									Ext.log({level: 'error', msg: 'Ошибка сохранения описания книги ' + art, dump: errMsg});
									errMsg = errMsg && errMsg.length ? '<p>Ошибки:</p>' + errMsg.join('</br></br>') : response.responseText;

									Ext.Msg.show(
										{
											title: 'Ошибка',
											message: 'Невозможно сохранить описание книги по адресу ' +
											         url + errMsg,
											buttons: Ext.MessageBox.OK,
											icon: Ext.MessageBox.ERROR
										}
									);
								}
							},
							failure: function (response)
							{
								var status;

								status = response.statusText ? ' (' + response.statusText + ')' : '';
								btn.enable();
								//field.enable();

								Ext.log({level: 'error', msg: 'Ошибка сохранения описания книги ' + art, dump: response});
								Ext.Msg.show(
									{
										title: 'Ошибка',
										message: 'Невозможно сохранить описание книги по адресу ' + url + status,
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									}
								);
							}
						}
					);
				}
				catch (e)
				{
					Ext.log({level: 'error', msg: 'Ошибка сохранения описания книги', dump: e});
					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно сохранить описание книги по адресу ' + url + status,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);
				}
			}
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
							var json = JSON.parse(response.responseText),
								newId = id[0],
								root;

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
				desc,
				delay,
				annotation,
				preamble;

			try
			{
				if (content.isActiveItem('form-desc'))
				{
					// переключаемся на пустую панель
					me.needShowForm = true;
					content.fireEvent('contentEmpty');
				}

				desc = FBEditor.util.xml.Json.xmlToJson(xml);
				desc = desc['fb3-description'];
				me.fb3DescId = desc._id;
				desc.xml = xml;

				// преобразуем данные для полей на основе htmleditor
				xml = xml.replace(/[\n\r\t]/g, '');
				annotation = xml.match(/<annotation>(.*?)<\/annotation>/);
				desc.annotation = annotation ? annotation[1] : '';
				preamble = xml.match(/<preamble>(.*?)<\/preamble>/);
				desc.preamble = preamble ? preamble[1] : '';
				//console.log('desc', desc);

				// конвертируем данные для формы
				desc = converter.toForm(desc);
				//console.log('desc convert', desc);
			}
			catch (e)
			{
				if (me.needShowForm)
				{
					// переключаемся на текст для инициализации необходимых компонентов
					content.fireEvent('contentBody');

					// переключаемся на описание
					me.needShowForm = false;
					content.fireEvent('contentDesc');
				}

				throw e;
			}

			// задержка
			delay = me.isLoadUrl() ? 100 : 0;

			Ext.defer(
				function ()
				{
					// указываем, что данные вводятся не пользователям, а во время загрузки
					me.loadingProcess = true;

					// создаем контент в полях редактора текста
					Ext.Array.each(
						editorNames,
					    function (name)
					    {
						    var editor,
							    manager,
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
							    // полноценная xml-строка
							    data = '<?xml version="1.0" encoding="UTF-8"?>' + data;

							    // редактор текста
							    editor = Ext.getCmp('form-desc-' + name).getBodyEditor();

							    // менеджер редактора
							    manager = editor.getManager();

							    // создаем контент редактора из xml-строки
							    manager.createContent(data);
						    }
					    }
					);

					// отправляем данные в форму описания
					form.fireEvent('loadDesc', desc);

					me.loadingProcess = false;

					if (FBEditor.accessHub)
					{
						// если доступ к хабу есть, то показываем поля поиска
						form.fireEvent('accessHub')
					}

					if (me.needShowForm)
					{
						// переключаемся на текст для инициализации необходимых компонентов
						content.fireEvent('contentBody');

						// переключаемся на описание
						me.needShowForm = false;
						content.fireEvent('contentDesc');
					}
				},
			    delay
			);
		},

		/**
		 * Загружается ли описание отдельно по url.
		 * @return {Boolean}
		 */
		isLoadUrl: function ()
		{
			var me = this,
				url = me.loadUrl,
				res;

			res = url && url !== 'undefined' ? true : false;

			return res;

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
		 * @return {String} Строка xml.
		 */
		getMetaXml: function (values)
		{
			var me = this,
				form = Ext.getCmp('form-desc'),
				fileManager = FBEditor.file.Manager,
				xml,
				data,
				rev,
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
			rev = fileManager.fb3file ? Number(fileManager.fb3file.getStructure().getMeta().revision.__text) : 0;
			rev = Ext.isNumber(rev) ? rev + 1 : 1;
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

			return xml;
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

			reg = /[^\u0020-\u005E\u0060-\u007E\u00A0-\u02AF\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u0482\u048A-\u0513\u0531-\u0556\u055A-\u055F\u0561-\u0587\u0589-\u058A\u0591-\u05F4\u05D0-\u05EA\u05F0-\u05F4\u0606-\u06DC\u06EE-\u070D\u0712-\u072F\u074D-\u076D\u0780-\u07A5\u07C0-\u07EA\u07F6-\u07F9\u0904-\u0939\u0958-\u0961\u0964-\u0970\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B6-\u09B9\u09DC-\u09DD\u09DF-\u09E1\u09E6-\u09FA\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0AE0-\u0AE1\u0AE6-\u0AEF\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B5C-\u0B5D\u0B5F-\u0B61\u0B66-\u0B71\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BE6-\u0BFA\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60-\u0C61\u0C66-\u0C6F\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CE0-\u0CE1\u0CE6-\u0CEF\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60-\u0D61\u0D66-\u0D6F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DC0-\u0DC6\u0E01-\u0E5B\u0E32-\u0E33\u0E3F-\u0E45\u0E4F-\u0E5B\u0E81-\u0E82\u0E87-\u0E88\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EC0-\u0EC4\u0ED0-\u0ED9\u0EDC-\u0EDD\u0F00-\u0F17\u0F1A-\u0F34\u0F3A-\u0F3D\u0F40-\u0F47\u0F49-\u0F6A\u0F88-\u0F8B\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCF-\u0FD1\u1000-\u1021\u1023-\u1027\u1029-\u102A\u1040-\u1055\u10A0-\u10C5\u10D0-\u10FB\u1100-\u11FF\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u1399\u13A0-\u13F4\u1401-\u1676\u1681-\u169C\u16A0-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1735-\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D4-\u17D6\u17D8-\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1800-\u180A\u1810-\u1819\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u1900-\u191C\u1944-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u19D0-\u19D9\u19DE-\u1A16\u1A1E-\u1A1F\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B6A\u1B74-\u1B7C\u1D00-\u1D2B\u1D62-\u1D77\u1D79-\u1D9A\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u200E-\u200F\u2010-\u2027\u2030-\u203E\u2041-\u2053\u2055-\u205F\u2070-\u2071\u2074-\u208E\u20A0-\u20B5\u2100-\u214E\u2153-\u2184\u2190-\u23E7\u2400-\u2426\u2440-\u244A\u2460-\u269C\u2600-\u26FF\u2701-\u2704\u2706-\u2709\u270C-\u2727\u2729-\u274B\u274F-\u2752\u2758-\u275E\u2761-\u2794\u2798-\u27AF\u27B1-\u27BE\u27C0-\u27CA\u27D0-\u27EB\u27F0-\u2B1A\u2B20-\u2B23\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6C\u2C74-\u2C77\u2C80-\u2CEA\u2CF9-\u2D25\u2D30-\u2D65\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E00-\u2E17\u2E1C-\u2E1D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u3004\u3006-\u3029\u3036-\u303A\u303C-\u303F\u3041-\u3096\u309B-\u309C\u309F-\u30FB\u3105-\u318F\u3131-\u318E\u3190-\u31B7\u31C0-\u31CF\u31F0-\u321E\u3220-\u3243\u3250-\u32FE\u3300-\u3400\u4DC0-\u9FFF\uA000-\uA014\uA016-\uA48C\uA490-\uA4C6\uA700-\uA716\uA720-\uA721\uA800-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA828-\uA82B\uA840-\uA877\uA960-\uA97F\uAC00-\uD7AF\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1F-\uFB36\uFB38-\uFB3C\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3F\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE10-\uFE19\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFF01-\uFF3E\uFF40-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC-\uFFFD\u10000-\u1000B\u1000D-\u10026\u10028-\u1003A\u1003C-\u1003D\u1003F-\u1004D\u10050-\u1005D\u10080-\u100FA\u10100-\u10102\u10107-\u10133\u10137-\u1018A\u10300-\u1031E\u10320-\u10323\u10330-\u1034A\u10380-\u1039D\u1039F-\u103C3\u103C8-\u103D5\u10400-\u1049D\u104A0-\u104A9\u10800-\u10805\u1080A-\u10835\u10837-\u10838\u10900-\u10919\u10A10-\u10A13\u10A15-\u10A17\u10A19-\u10A33\u10A40-\u10A47\u10A50-\u10A58\u12000-\u1236E\u12400-\u12462\u12470-\u12473\u1D000-\u1D0F5\u1D100-\u1D126\u1D12A-\u1D164\u1D16A-\u1D16C\u1D183-\u1D184\u1D18C-\u1D1A9\u1D1AE-\u1D1DD\u1D200-\u1D241\u1D300-\u1D356\u1D360-\u1D371\u1D400-\u1D454\u1D456-\u1D49C\u1D49E-\u1D49F\u1D4A5-\u1D4A6\u1D4A9-\u1D4AC\u1D4AE-\u1D4B9\u1D4BD-\u1D4C3\u1D4C5-\u1D505\u1D507-\u1D50A\u1D50D-\u1D514\u1D516-\u1D51C\u1D51E-\u1D539\u1D53B-\u1D53E\u1D540-\u1D544\u1D54A-\u1D550\u1D552-\u1D6A5\u1D6A8-\u1D7CB\u1D7CE-\u1D7FF\u2F800-\u2FA1D]/g;

			return reg;
		}
	}
);