/**
 * Абстрактный класс, определяющий связи между различными частями архива.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.AbstractRels',
	{
		/**
		 * @property {String} Содержимое файла по умолчанию.
		 */
		defaultContent: '',

		/**
		 * @property {String} Префикс перед именем свойств в json, которые являлись аттрибутами в xml
		 * (берется из FBEditor.util.xml.Json#prefix).
		 */
		prefix: '',

		/**
		 * @protected
		 * @property {Object} Ссылки на части архива.
		 */
		rels: null,

		/**
		 * @private
		 * @property {Object} Файл.
		 */
		file: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.Structure} structure Структура архива FB3.
		 */
		structure: null,

		/**
		 * @private
		 * @property {String} Имя файла.
		 */
		fileName: null,

		/**
		 * @private
		 * @property {String} Имя файла, содержащицй связи для текущего файла.
		 */
		relsName: null,

		/**
		 * @private
		 * @property {String} Родительская директория текущего файла.
		 */
		parentDir: null,

		/**
		 * @private
		 * @property {String} Директория архива FB3, в которой находится текущая директория _rels.
		 */
		parentRelsDir: null,

		/**
		 * @private
		 * @property {Blob} Исходные данные файла.
		 */
		blob: null,

        /**
         * @abstract
         * Возвращает связи для файла.
         * @resolve {Object} Связи.
         * @return {Promise}
         */
        getRels: function ()
        {
            throw Error('Не реализован метод FB3.rels.AbstractRels#getRels');
        },

		/**
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 * @param {String} [parentRelsDir] Директория архива FB3, в которой находится текущая директория _rels.
		 */
		constructor: function (structure, fileName, parentRelsDir)
		{
			var me = this,
				fb3file,
				mimeType;

			fb3file = structure.getFb3file();

			if (!fb3file.getFiles(fileName))
			{
				me.create(structure, fileName);
			}

			me.structure = structure;
			me.fileName = decodeURI(fileName);
			me.parentRelsDir = parentRelsDir ? parentRelsDir : null;
			me.relsName = me.getRelsName();
			me.file = me.structure.getFb3file().getFiles(fileName);
			me.prefix = FBEditor.util.xml.Json.prefix;

			me.getRels().then(
				function (rels)
				{
					me.rels = rels;

					return me.getBlob();
				}
			).then(
                function (blob)
                {
                    mimeType = me.parseMimeType();

                    if (mimeType)
					{
                        me.blob = new Blob([blob], {type: mimeType});
					}
                }
            );
		},

		/**
		 * Создает файл по умолчанию.
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 */
		create: function (structure, fileName)
		{
			var me = this,
				fb3file = structure.getFb3file(),
				zip;

			zip = fb3file.zip;
			zip.file(fileName, me.defaultContent);
			fb3file.setFiles();
		},

		/**
		 * Возвращает структуру архива FB3.
		 * @return {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		getStructure: function ()
		{
			var me = this;

			return me.structure;
		},

		/**
		 * Возвращает имя файла.
		 * @return {String} Имя файла.
		 */
		getFileName: function ()
		{
			var me = this;

			return me.fileName;
		},

		/**
		 * Возвращает базовое имя файла без полного пути.
		 * @return {String} Имя файла.
		 */
		getBaseFileName: function ()
		{
			var me = this,
				fileName = me.getFileName(),
				name;

			name = fileName.replace(/.*\/(.*?\.\w+)$/, '$1');

			return name;
		},

		/**
		 * Возвращает расширение файла.
		 * @return {String} Имя файла.
		 */
		getExtension: function ()
		{
			var me = this,
				fileName = me.getFileName(),
				ext;

			ext = fileName.replace(/.*\/.*?\.(\w+)$/, '$1');

			return ext;
		},

		/**
		 * Возвращает дату последней модификации файла.
		 * @return {Date} Объект даты.
		 */
		getDate: function ()
		{
			var me = this,
				date;

			date = me.file.date;

			return date;
		},

		/**
		 * Возвращает имя файла, содержащицй связи для текущего файла.
		 * @return {String} Имя файла.
		 */
		getRelsName: function ()
		{
			var me = this,
				fileName = me.getFileName(),
				parentDir,
				currentName,
				relsName = me.relsName;

			if (!relsName)
			{
				fileName = fileName.split('/');
				currentName = fileName.pop();
				parentDir = fileName.join('/');

				// первый слеш
				me.parentDir = /^\//.test(parentDir) ? parentDir : '/' + parentDir;

				relsName = parentDir + '/_rels/' + currentName + '.rels';
			}

			return relsName;
		},

		/**
		 * Возвращает родительскую директорию текущего файла.
		 * @return {String} Имя директории.
		 */
		getParentDir: function ()
		{
			var me = this;

			return me.parentDir;
		},

		/**
		 * Возвращает директорию архива FB3, в которой находятися текущая директория _rels.
		 * @return {String} Имя директории.
		 */
		getParentRelsDir: function ()
		{
			var me = this;

			return me.parentRelsDir;
		},

		/**
		 * Возвращает содержмиое файла как JSON.
		 * @resolve {Object} Xml в виде JSON.
		 * @return {Promise}
		 */
		getJson: function ()
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
                    me.getText().then(
                        function (text)
                        {
                            var utilJson = FBEditor.util.xml.Json,
                                json;

                            json = utilJson.xmlToJson(text);

                            resolve(json);
                        }
                    );
				}
			);

			return promise;
		},

		/**
		 * Возвращает содержмиое файла как текст.
		 * @resolve {String} XML в виде текста.
		 * @return {Promise}
		 */
		getText: function ()
		{
			var me = this,
				file = me.file;

			return file.async('string');
		},

		/**
		 * Возвращает содержимое файла в ArrayBuffer.
		 * @resolve {ArrayBuffer} Содержимое файла.
         * @return {Promise}
		 */
		getArrayBuffer: function ()
		{
            var me = this,
                file = me.file;

            return file.async('arraybuffer');
		},

        /**
         * Возвращает содержимое файла в ArrayBuffer.
         * @resolve {ArrayBuffer} Содержимое файла.
         * @return {Promise}
         */
        getBlob: function ()
        {
            var me = this,
                file = me.file,
				blob = me.blob,
				promise;

            if (!blob)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        file.async('blob').then(
                        	function (blob)
							{
                                var mimeType = me.parseMimeType();

                                me.blob = new Blob([blob], {type: mimeType});

                                resolve(me.blob);
							}
						);
					}
				);

			}
			else
			{
                promise = Promise.resolve(blob);
			}

            return promise;
        },

		/**
		 * Возвращает URL для доступа к ресурсу.
		 * @resolve {String} Путь к картинке.
		 * @return {Promise}
		 */
		getUrl: function ()
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					me.getBlob().then(
						function (blob)
						{
							var url;

                            url = window.URL.createObjectURL(blob);

                            resolve(url);
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Вовзращает размер файла в байтах.
		 * @resolve {Number} Размер файла.
		 * @return {Promise}
		 */
		getSize: function ()
		{
            var me = this,
                promise;

            promise = new Promise(
                function (resolve, reject)
                {
                    me.getBlob().then(
                        function (blob)
                        {
                            resolve(blob.size);
                        }
                    );
                }
            );

            return promise;
		},

		/**
		 * Вовзращает mime-тип файла.
		 * @resolve {String} Mime-тип.
		 * @return {Promise}
		 */
		getType: function ()
		{
            var me = this,
                promise;

            promise = new Promise(
                function (resolve, reject)
                {
                    me.getBlob().then(
                        function (blob)
                        {
                            resolve(blob.type);
                        }
                    );
                }
            );

            return promise;
		},

		/**
		 * Устанавливает содержимое файла.
		 * @param {String} data Содержимое файла.
		 */
		setFileContent: function (data)
		{
			var me = this,
				fb3file = me.structure.fb3file,
				fileName = me.getFileName(),
				zip;

			zip = fb3file.zip;
			fileName = encodeURI(fileName);
			zip.file(fileName, data);
		},

		/**
		 * Перемещает файл в новую директорию архива.
		 * @param {String} folder Путь к директории.
		 * @resolve {String} Новое имя файла.
		 * @return {Promise}
		 */
		moveTo: function (folder)
		{
			var me = this,
				fb3file = me.structure.fb3file,
				fileName = me.getFileName(),
				promise,
				newFileName,
				zip;

			zip = fb3file.zip;
			newFileName = folder + '/' + me.getBaseFileName();

			promise = new Promise(
				function (resolve, reject)
				{
                    me.getArrayBuffer().then(
                        function (arraybuffer)
                        {
                            zip.file(newFileName, arraybuffer);
                            zip.remove(fileName);
                            me.fileName = newFileName;

                            resolve(newFileName);
                        }
                    );
				}
			);


			return promise;
		},

		/**
		 * @private
		 * Парсит название файла и возвращает mime-тип.
		 * @return {String} Mime-тип.
		 */
		parseMimeType: function ()
		{
			var me = this,
				type = '';

			type = /\.svg$/.test(me.fileName) ? 'image/svg+xml' : type;
			type = /\.png$/.test(me.fileName) ? 'image/png' : type;
			type = /\.(jpg|jpeg)$/.test(me.fileName) ? 'image/jpeg' : type;
			type = /\.gif$/.test(me.fileName) ? 'image/gif' : type;

			return type;
		}
	}
);