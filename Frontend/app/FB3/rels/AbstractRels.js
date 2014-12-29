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
		 * @property {String} Директория архива FB3, в которой находятися текущая директория _rels.
		 */
		parentRelsDir: null,

		/**
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 * @param {String} [parentRelsDir] Директория архива FB3, в которой находятися текущая директория _rels.
		 */
		constructor: function (structure, fileName, parentRelsDir)
		{
			var me = this,
				fb3file = structure.getFb3file();

			if (!fb3file.getFiles(fileName))
			{
				me.create(structure, fileName);
			}
			me.structure = structure;
			me.fileName = fileName;
			me.parentRelsDir = parentRelsDir ? parentRelsDir : null;
			me.relsName = me.getRelsName();
			me.file = me.structure.getFb3file().getFiles(fileName);
			me.prefix = FBEditor.util.xml.Json.prefix;
			me.rels = me.getRels();
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
			var me = this;

			return me.fileName;
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
				me.parentDir = parentDir;
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
		 * Возвращает URL для доступа к ресурсу.
		 * @return {String} Путь к картинке.
		 */
		getUrl: function ()
		{
			var me = this,
				buffer = me.file.asArrayBuffer(),
				blob,
				url;

			blob = new Blob([buffer]);
			url = window.URL.createObjectURL(blob);

			return url;
		},

		/**
		 * Устанавливает содержимое файла.
		 * @param {String} data Содержимое файла.
		 */
		setFileContent: function (data)
		{
			var me = this,
				fb3file = me.structure.fb3file,
				fileName = me.fileName,
				zip;

			zip = fb3file.zip;
			zip.file(fileName, data);
		}
	}
);