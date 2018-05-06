/**
 * Файл FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.File',
	{
		/**
		 * @private
		 * @property {Object} Файлы архива.
		 */
		files: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		structure: null,

		/**
		 * @private
		 * @property {FBEditor.file.Zip} Zip-Архиватор.
		 */
		zip: null,

		/**
		 * @private
		 * @property {Object} Данные книги.
		 */
		data: null,

		/**
		 * @param {Object} data Данные книги.
		 */
		constructor: function (data)
		{
			var me = this;

			me.zip = Ext.create('FBEditor.file.Zip');
			me.data = data;
		},

		/**
		 * Возвращает структуру архива FB3.
		 * @resolve {FBEditor.FB3.Structure} Структура архива FB3.
		 * @return {Promise|FBEditor.FB3.Structure}
		 */
		getStructure: function ()
		{
			var me = this,
				zip = me.zip,
				data = me.data.content,
				structure = me.structure,
				promise;

			if (!structure)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        zip.unPackage(data).then(
                            function (unpackData)
                            {
                                me.setFiles();
                                structure = Ext.create('FBEditor.FB3.Structure', me);
                                me.structure = structure.load();

                                resolve(structure);
                            }
                        ).catch(
                            function (e)
                            {
                                reject(e);
                            }
                        );
					}
				);
			}
			else
			{
				promise = Promise.resolve(structure);
			}

			return promise;
		},

		/**
		 * Обновляет структуру и данные архива FB3.
		 * @param {Object} data Данные книги.
		 */
		updateStructure: function (data)
		{
			var me = this,
				structure = me.structure;

			//console.log('DATA', data);
			
			if (data.thumb)
			{
				structure.setThumb(data.thumb);
			}

			structure.setMeta(data.meta);

            structure.getBooks().then(
            	function (books)
				{
                    Ext.Object.each(
                        data.books,
                        function (index, bookData)
                        {
                            structure.setDesc(books[index], bookData.desc);

                            structure.getBodies(books[index]).then(
                                function (bodies)
                                {
                                    Ext.each(
                                        bookData.bodies,
                                        function (bodyData, i)
                                        {
                                            structure.setContent(bodies[i], bodyData.content);
                                            structure.setImages(bodies[i], bodyData.images);
                                        }
                                    );
                                }
                            );
                        }
                    );
				}
			);
		},

		/**
		 * Создает структуру архива FB3 и обновляет в ней данные.
		 */
		createStructure: function ()
		{
			var me = this,
				structure;

			structure = Ext.create('FBEditor.FB3.Structure', me);
			me.structure = structure.create();
			me.updateStructure(me.data);
		},

		/**
		 * Возвращает файлы архива или конкретный файл по переданному имени.
		 * @param {String} [name] Имя файла.
		 * @return {Object} Файлы или один файл.
		 */
		getFiles: function (name)
		{
			var me = this,
				result = null;

			if (me.files)
			{
				// удаляем первый слеш
				name = name ? name.replace(/^\//, '') : name;

				result = name ? me.files[name] : me.files;
				result = result || null;

				if (!result)
				{
					Ext.log(
						{
							level: 'warn',
							msg: 'В архиве отсутствует файл ' + name +
							     ', на который ссылается один из существующих файлов',
							dump: me.files
						}
					);
				}
			}

			return result;
		},

		/**
		 * Возвращает имя файла.
		 * @return {String} Имя файла.
		 */
		getName: function ()
		{
			var me = this,
				data = me.data,
				defaultName = FBEditor.file.Manager.defaultFb3FileName,
				name;

			name = data.file ? data.file.name.replace(/(\.fb3(\.zip)?)$/, '') : defaultName;

			return name;
		},

		/**
		 * Устанавливает файлы из архива.
		 */
		setFiles: function ()
		{
			var me = this,
				zip = me.zip;

			me.files = zip.getFiles();
			//console.log('me.files', me.files);
		},

		/**
		 * Генерирует файл FB3 в Blob.
		 * @resolve {Blob} Данные Blob.
		 * @return {Promise}
		 */
		generateBlob: function ()
		{
			var me = this,
				zip = me.zip;

            return zip.generateBlob();
		}
	}
);