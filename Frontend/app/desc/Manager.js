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
		 * @property {String} Адрес загрузки описания.
		 */
		loadUrl: null,

		/**
		 * @property {String} Адрес сохранения описания.
		 */
		saveUrl: null,

		init: function ()
		{
			var me = this,
				hash,
				reg;

			reg = /^#desc\//;
			hash = location.hash;

			if (reg.test(hash))
			{
				// запоминаем url загрузки описания
				me.loadUrl = hash.substring(6);
			}
			else if (hash === '#desc')
			{
				me.loadUrl = 'undefined';
			}
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

			btn = bridge.Ext.getCmp('button-desc-load');
			me.loadUrl = url;
			Ext.log({level: 'info', msg: 'Загрузка описания из ' + url});
			btn.disable();

			Ext.Ajax.request(
				{
					url: url,
					success: function(response)
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
				bridge = FBEditor.getBridgeProps(),
				btn = bridge.Ext.getCmp('button-desc-save'),
				field = bridge.Ext.getCmp('panel-props-desc').getSaveField(),
				xml;

			xml = me.getXml();
			Ext.log({level: 'info', msg: 'Сохранение описания в ' + url});
			btn.disable();
			field.disable();

			Ext.Ajax.request(
				{
					url: url,
					params: {
						action: 'update_hub_on_fb3_meta',
						fb3_meta: xml
					},
					disableCaching: true,
				    success: function (response)
				    {
					    console.log('Описание сохранено', response.responseText);
					    btn.enable();
					    field.enable();
				    },
				    failure: function (response)
				    {
					    var status;

					    status = response.statusText ? ' (' + response.statusText + ')' : '';
					    btn.enable();
					    field.enable();

					    Ext.log({level: 'error', msg: 'Ошибка сохранения описания книги', dump: response});
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
				desc,
				annotation,
				history,
				delay;

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

				xml = xml.replace(/[\n\r\t]/g, '');
				annotation = xml.match(/<annotation>(.*?)<\/annotation>/);
				desc.annotation = annotation ? annotation[1] : '';
				history = xml.match(/<history>(.*?)<\/history>/);
				desc.history = history ? history[1] : '';
				desc = converter.toForm(desc);
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
					form.fireEvent('loadDesc', desc);

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
				xsd,
				data;

			data = values || form.getValues();
			data = {
				'fb3-description': data
			};
			data['fb3-description']._xmlns = 'http://www.fictionbook.org/FictionBook3/description';
			data['fb3-description']._id = '';
			data['fb3-description']._version = '1.0';
			xml = FBEditor.util.xml.Json.jsonToXml(data);
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			//console.log(xml);

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
					'cp:contentStatus': data['fb3-classification']['class']._contents,
					'cp:category': data['fb3-classification']['class'].__text,
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
		}
	}
);