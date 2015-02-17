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
							var structure,
								thumb,
								meta,
								books,
								desc,
								bodies,
								images,
								contentBody,
								contentTypes,
								xslBody;

							try
							{
								me.fb3file = Ext.create('FBEditor.FB3.File', {file: file.file, content: data});
								structure = me.fb3file.getStructure();
								thumb = structure.getThumb();
								contentTypes = structure.getContentTypes();
								contentTypes = FBEditor.converter.contentTypes.Data.toNormalize(contentTypes);
								meta = structure.getMeta();
								books = structure.getBooks();
								desc = structure.getDesc(books[0]);
								bodies = structure.getBodies(books[0]);
								images = structure.getImages(bodies[0]);
								contentBody = structure.getContent(bodies[0]);
								console.log('contentTypes', contentTypes);
								console.log('thumb', thumb);
								//console.log('meta', meta);
								//console.log('books', books);
								//console.log('desc', desc);
								//console.log('images', images);
								//console.log(content);
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
										message: 'Невозможно открыть книгу',
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									}
								);
							}
							xslBody = FBEditor.xsl.Body.getXmlToHtml();
							contentBody = FBEditor.util.xml.Jsxml.trans(contentBody, xslBody);
							contentBody = contentBody.replace(/<fb3-body (.*?)>/i, '');
							contentBody = contentBody.replace(/<\/fb3-body>/i, '');
							//console.log(contentBody);
							//Ext.suspendLayouts();
							Ext.getCmp('main-htmleditor').fireEvent('loadtext', contentBody);
							Ext.getCmp('form-desc').fireEvent('loadDesc', desc);
							FBEditor.resource.Manager.load(images);
							//Ext.resumeLayouts(true);
						}
					}
				);
			}

			return result;
		},

		/**
		 * Открывает файл ресурса.
		 * @param {Object} evt Событие открытие файла.
		 * @return {Boolean} Успешно ли открытие.
		 */
		openResource: function (evt)
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
							try
							{
								//Ext.suspendLayouts();
								FBEditor.resource.Manager.loadResource({file: file.file, content: data});
								//Ext.resumeLayouts(true);
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
										message: 'Невозможно заугрузить ресурс ' + (e ? '(' + e + ')' : ''),
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									}
								);
							}
						}
					}
				);
			}

			return result;
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
		 * @return {Boolean} Вызвано ли окно сохранения.
		 */
		saveFB3: function (data, fn)
		{
			var me = this,
				fb3file = me.fb3file,
				blob,
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
			blob = fb3file.generateBlob();
			fs = window.saveAs(blob, fb3file.getName());

			// данные функции должны быть реализованы в будущих браузерах, пока же они не выполняются
			fs.onwriteend = fn;
			fs.onabort = fn;

			return fs ? true : false;
		}
	}
);