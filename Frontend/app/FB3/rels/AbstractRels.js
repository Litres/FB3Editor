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
		 * @private
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
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 * @param {String} [parentRelsDir] Директория архива FB3, в которой находится текущая директория _rels.
		 */
		constructor: function (structure, fileName, parentRelsDir)
		{
			var me = this,
				fb3file;

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
			me.rels = me.getRels();
			me.blob = new Blob([me.file.asArrayBuffer()], {type: me.parseMimeType()});
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
		 * @abstract
		 * Возвращает связи для файла.
		 * @return {Object} Связи.
		 */
		getRels: function ()
		{
			throw Error('Не реализован метод FB3.rels.AbstractRels#getRels');
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
			var me = this,
				name = me.fileName;

			return name;
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
		 * @return {Object} Xml в виде JSON.
		 */
		getJson: function ()
		{
			var me = this,
				text = me.getText(),
				result;

			result = FBEditor.util.xml.Json.xmlToJson(text);

			return result;
		},

		/**
		 * Возвращает содержмиое файла как текст.
		 * @return {String} XML в виде текста.
		 */
		getText: function ()
		{
			var me = this,
				file = me.file;

			return file.asText();
		},

		/**
		 * Возвращает содержимое файла в ArrayBuffer.
		 * @return {ArrayBuffer} Содержимое файла.
		 */
		getArrayBuffer: function ()
		{
			return this.file.asArrayBuffer();
		},

		/**
		 * Возвращает URL для доступа к ресурсу.
		 * @return {String} Путь к картинке.
		 */
		getUrl: function ()
		{
			var me = this,
				blob = me.blob,
				url;

			url = window.URL.createObjectURL(blob);

			return url;
		},

		/**
		 * Вовзращает размер файла в байтах.
		 * @return {Number} Размер файла.
		 */
		getSize: function ()
		{
			return this.blob.size;
		},

		/**
		 * Вовзращает mime-тип файла.
		 * @return {String} Mime-тип.
		 */
		getType: function ()
		{
			return this.blob.type;
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
		 */
		moveTo: function (folder)
		{
			var me = this,
				fb3file = me.structure.fb3file,
				fileName = me.getFileName(),
				newFileName,
				data,
				zip;

			zip = fb3file.zip;
			newFileName = folder + '/' + me.getBaseFileName();
			data = me.file.asArrayBuffer();
			zip.file(newFileName, data);
			zip.remove(fileName);
			me.fileName = newFileName;
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