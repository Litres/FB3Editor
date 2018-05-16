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
		 * @resolve
		 * @return {Promise}
		 */
		updateStructure: function (data)
		{
			var me = this,
				structure = me.structure,
				booksData,
				promise;

			//console.log('DATA', data);

			promise = new Promise(
				function (resolve, reject)
				{
					// подшивки
                    booksData = data.books;

                    structure.setThumb(data.thumb).then(
                    	function (thumbContent)
						{
                            return structure.setMeta(data.meta);
						}
					).then(
						function (meta)
						{
                            return structure.getBooks();
						}
					).then(
                        function (books)
                        {
                        	// устанавливаем данные подшивок
                        	return me.setBooksContent(books, booksData);
                        }
                    ). then(
                    	function ()
						{
							resolve(structure);
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Создает структуру архива FB3 и обновляет в ней данные.
		 * @resolve
		 * @return {Promise}
		 */
		createStructure: function ()
		{
			var me = this,
				promise,
				structure;

			structure = Ext.create('FBEditor.FB3.Structure', me);
			me.structure = structure.create();
			promise = me.updateStructure(me.data);

			return promise;
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
		},

        /**
		 * @private
		 * Устанавливает содержимое подшивок.
         * @param {FBEditor.FB3.rels.Book|FBEditor.FB3.rels.Book[]} books Книга или массив книг.
		 * @param {Object} booksData Данные подшивок.
		 * @param {Number} [bookNumber] Номер подшивки.
		 * @resolve
		 * @return {Promise}
         */
        setBooksContent: function (books, booksData, bookNumber)
		{
			var me = this,
                structure = me.structure,
				book,
                bookData,
				promise;

            bookNumber = bookNumber || 0;

			promise = new Promise(
				function (resolve, reject)
				{
                    if (bookNumber < books.length)
					{
						// подшивка
						book = books[bookNumber];

						// данные подшивки
                        bookData = booksData[bookNumber];

                        // устанавливаем описание
                        structure.setDesc(book, bookData.desc);

                        // получаем тела книги
                        structure.getBodies(book).then(
                        	function (bodies)
							{
                                // устанавливаем содержимое тел книг
								return me.setBodiesContent(bodies, bookData.bodies);
							}
						).then(
							function ()
							{
                                // переходим к следующей подшивке
                                return me.setBooksContent(books, booksData, bookNumber + 1);
							}
						).then(
							function ()
							{
								resolve();
							}
						);
                    }
                    else
					{
                        // все подшивки перебрали, возвращаем результат
                        resolve();
					}
				}
			);

			return promise;
		},

        /**
		 * @private
		 * Усьанавливает содержимое тел книг.
         * @param {FBEditor.FB3.rels.Body[]} bodies Тела книг.
         * @param {Object} bodiesData Данные тел книг.
		 * @param {Number} [bodyNumber] Номер тела книги.
		 * @resolve
		 * @return {Promise}
         */
        setBodiesContent: function (bodies, bodiesData, bodyNumber)
		{
			var me = this,
                structure = me.structure,
				body,
				bodyData,
				promise;

            bodyNumber = bodyNumber || 0;

			promise = new Promise(
				function (resolve, reject)
				{
                    if (bodyNumber < bodies.length)
					{
                        // тело книги
                        body = bodies[bodyNumber];

                        // данные тела книги
                        bodyData = bodiesData[bodyNumber];

                        // устанавливаем данные тела книги
                        structure.setContent(body, bodyData.content);

                        // устанавливаем данные ресурсов
                        structure.setImages(body, bodyData.images).then(
                            function (imagesRels)
                            {
                                // переходим к следующему телу книги
								return me.setBodiesContent(bodies, bodiesData, bodyNumber + 1);
                            }
                        ).then(
                        	function ()
							{
								resolve();
							}
						);
					}
					else
					{
                        // все тела книги перебрали, возвращаем результат
						resolve();
					}

				}
			);

			return promise;
		}
	}
);