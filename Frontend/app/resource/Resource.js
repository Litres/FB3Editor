/**
 * Ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Resource',
	{
		fileId: null, // айди ресурса 
		content: null, // содержимое в виде ArrayBuffer
		blob: null, // содержимое в виде Blob
		url: '', // адрес в памяти браузера
		name: '', // полное имя файла относительно корневой директории ресурсов в архиве
		baseName: '', // базовое имя файла
		rootName: '', // полное имя файла, включая корневую директории ресурсов в архиве
		modifiedDate: null, // дата изменения файла Date
		sizeBytes: null, // рамзер файла в байтах
		size: '', // отформатированный размер файла
		type: '', // mime-тип
		date: '', // отформатированная дата изменения файла
		extension: '', // разрешение файла
		width: null,
		height: null,
		isFolder: false, // папка ли
		isCover: false, // обложка ли
		totalElements: 0, // количество ссылок на изображения в тексте книги

		/**
		 * @property {String} Формат даты.
		 */
		formatDate: 'd.m.Y H:i',

		/**
		 * @private
		 * @property {FBEditor.editor.element.ImgElement[]} Элементы изображения в теле книги, связанные с ресурсом.
		 */
		elements: null,

        /**
		 * @private
         * @property {FBEditor.editor.element.ImgElement} Элемент изображения, который вставлен в текст после копипаста.
         */
        pasteEl: null,

		/**
		 * Инициализирует ресурс.
		 * @param {FBEditor.resource.data.AbstractData} data Данные ресурса.
		 */
		constructor: function (data)
		{
			var me = this;

            me.elements = [];
			me.setData(data);
		},

        /**
		 * Возвращает связанные с ресурсом.
         * @return {FBEditor.editor.element.ImgElement[]}
         */
        getElements: function ()
		{
			return Ext.clone(this.elements);
		},

        /**
		 * Возвращает элемент, который был вставлен в тексте после копипаста.
         * @return {FBEditor.editor.element.ImgElement}
         */
		getPasteElement: function ()
		{
			return this.pasteEl;
		},

        /**
         * Связывает элементы с ресурсом.
         * @param {FBEditor.editor.element.ImgElement[]} elements Элементы текста.
         */
        setElements: function (elements)
        {
            this.elements = elements;
        },

        /**
         * Обновляет данные ресурса и связанные элементы в тексте.
         * @param {FBEditor.resource.data.AbstractData} data Данные для обновления.
         */
        updateData: function (data)
        {
            var me = this;

            me.setData(data);

            // обновляем элементы в тексте
            me.updateElements();
        },

        /**
         * Устанавливает данные ресурса.
         * @param {FBEditor.resource.data.AbstractData} data Данные.
         */
		setData: function (data)
		{
            var me = this,
                img = new Image();

            me.fileId = data.fileId || data.name;
            me.content = data.content;
            me.blob = data.blob;
            me.url = data.url;
            me.name = data.name;
            me.baseName = data.baseName;
            me.rootName = data.rootName;
            me.modifiedDate = data.modifiedDate;
            me.sizeBytes = data.sizeBytes;
            me.type = data.type;
            me.isCover = data.isCover;
            me.size = me.getSizeFormat();
            me.date = me.getDateFormat();
            me.extension = me.getExtension();
            img.src = me.url;

            img.onload = function ()
            {
                me.width = img.width;
                me.height = img.height;
            };

            // получаем base64
            me.getBase64().then(
                function (base64)
                {
                    me.base64 = base64;
                }
            );
		},

		/**
		 * Загружает ресурс в память.
		 * @return {Promise}
		 */
		load: function ()
		{
			return Promise.resolve(this);
		},

		/**
		 * Добавляет элемент изображения тела книги в коллекцию, связывая с ресурсом.
		 * @param {FBEditor.editor.element.ImgElement} el Элемент изображения, использующий ресурс.
		 */
		addElement: function (el)
		{
			var me = this,
				exist = false;

			Ext.each(
				me.elements,
				function (item)
				{
					if (item.equal(el))
					{
						exist = true;
						return false;
					}
				}
			);

			if (!exist)
			{
				//console.log('add', el);
				
				// если элемент еще не был связан, то добавляем связь
				me.elements.push(el);
				me.totalElements = me.elements.length;
			}
		},

        /**
		 * Устанавливает элемент, который вставлен в текст после копипаста.
         * @param el
         */
        setPasteElement: function (el)
		{
			var me = this;

			me.pasteEl = el;
		},

		/**
		 * Удаляет элемент изображения тела книги из коллекции ресурса.
		 * @param {FBEditor.editor.element.ImgElement} el Элемент изображения, использующий ресурс.
		 */
		removeElement: function (el)
		{
			var me = this,
				elements = me.elements;

			Ext.Array.each(
				elements,
				function (item, index)
				{
					if (Ext.Object.equals(el, item))
					{
						elements.splice(index, 1);
					}
				}
			);

			me.totalElements = elements.length;
			me.elements = elements;
		},

        /**
         * Обновляет связанный элемент.
         */
        updateElement: function (el)
        {
            var me = this,
                panelProps,
                focusEl,
                manager,
				data;

            data = el.attributes;
            data.src = me.fileId;

            manager = el.getManager();

            //console.log('el', el);

            el.update(data);

            if (manager)
            {
                focusEl = manager.getFocusElement();

                if (el.equal(focusEl))
                {
                    // панель свойств
                    panelProps = manager.getPanelProps();

                    if (panelProps)
                    {
                        // обновляем информацию о выделенном элементе в панели свойств
                        panelProps.fireEvent('loadData', el);
                    }
                }
            }
        },

		/**
		 * Обновляет связанные элементы.
		 */
		updateElements: function ()
		{
			var me = this,
				elements = me.elements;

			Ext.each(
				elements,
				function (el)
				{
					me.updateElement(el);
				}
			);
		},

		/**
		 * Удаляет все ссылки на ресурс в используемых элементах.
		 */
		clearElements: function ()
		{
			var me = this,
				elements = me.elements,
				el;

			while (elements.length)
			{
				el = elements[0];

				if (el)
				{
					el.deleteLinkResource();
				}

				elements.splice(0, 1);
			}

			me.totalElements = 0;
		},

		/**
		 * Переименовывает ресурс.
		 * @param {String} name Новое имя.
		 */
		rename: function (name)
		{
			var me = this;

			me.rootName = me.rootName.replace(me.name, name);
			me.name = name;
		},

		/**
		 * Возвращает отформатированный размер файла.
		 * @return {String} Размер файла.
		 */
		getSizeFormat: function ()
		{
			var me = this,
				size;

			size = me.sizeBytes ? FBEditor.util.Format.fileSize(me.sizeBytes) : null;

			return size;
		},

		/**
		 * Возвращает отформатированную дату.
		 * @return {String} Дата.
		 */
		getDateFormat: function ()
		{
			var me = this,
				date;

			date = me.modifiedDate ? Ext.Date.format(me.modifiedDate, me.formatDate) : null;

			return date;
		},

		/**
		 * Возвращает расширение файла.
		 * @return {String} Расширение файла.
		 */
		getExtension: function ()
		{
			var me = this,
				fileName = me.baseName,
				ext;

			ext = FBEditor.util.Format.getExtensionFile(fileName);

			return ext;
		},

        /**
		 * Возвращает данные ресурса в виде base64 строки (data:<image/type>;base64,<data>).
         * @return {Promise}
         */
		getBase64: function ()
		{
			var me = this,
				blob = me.blob,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					var str,
					reader;

                    reader = new FileReader();
                    reader.readAsDataURL(blob);

                    reader.onloadend = function()
                    {
                        str = reader.result;
                        resolve(str);
                    };
				}
			);

			return promise;
		}
	}
);