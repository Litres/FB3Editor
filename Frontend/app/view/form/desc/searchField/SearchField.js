/**
 * Поле поиска с отдельным окном и контейнером для отображения результатов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.searchField.SearchField',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.searchField.SearchFieldController'
		],
		controller: 'form.desc.searchField',
		xtype: 'form-desc-searchField',
		checkChangeBuffer: 200,
		plugins: [
			{
				ptype: 'fieldCleaner',
				style: 'left: 441px; right: auto'
			},
			{
				ptype: 'searchField',
				style: 'margin-left: 258px'
			}
		],

		keyEnterAsTab: true,

		listeners: {
			select: 'onSelect',
			afterrender: 'onAfterRender',
			change: 'onChange',
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		/**
		 * @property {Number} Максимальное количество записей хранящихся в локальном хранилище.
		 */
		localStorageLimit: 10,

		/**
		 * @private
		 * @property {Ext.Panel} Окно.
		 */
		win: null,

		initComponent: function ()
		{
			var me = this,
				win;

			win = me.createWindow();
			me.win = win;

			// устанавливаем связь окна с полем
			win.searchField = me;

			me.callParent(arguments);
		},

		destroy: function ()
		{
			var me = this,
				win;

			win = me.getWindow();
			win.destroy();
			me.callParent(arguments);
		},

		/**
		 * @abstract
		 * Создает и возвращает окно для отображения контейнера с результатами поиска.
		 * @return {Ext.Panel}
		 */
		createWindow: function ()
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#createWindow()');
		},

		/**
		 * @abstract
		 * Выполняет поиск.
		 */
		search: function ()
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#search()');
		},

		/**
		 * @abstract
		 * Возвращает параметры для запроса.
		 */
		getParams: function ()
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#getParams()');
		},

		/**
		 * @abstract
		 * Заполняет поля.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#updateData()');
		},

		/**
		 * @abstract
		 * Возвращает первое поисковое поле.
		 * @return {Ext.Component}
		 */
		getFirstSearch: function ()
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#getFirstSearch()');
		},

		/**
		 * @abstract
		 * Возвращает следующее поисковое поле.
		 * @return {Ext.Component}
		 */
		getNextSearch: function ()
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchField#getNextSearch()');
		},

		/**
		 * Возвращает окно.
		 * @return {Ext.Panel}
		 */
		getWindow: function ()
		{
			return this.win;
		},

		/**
		 * Возвращает контейнер с результатами.
		 * @return {Ext.Container}
		 */
		getContainerItems: function ()
		{
			var me = this,
				win = me.getWindow();

			return win.getContainerItems();
		},

		/**
		 * Возвращает хранилище данных.
		 * @return {FBEditor.store.AbstractStore}
		 */
		getStore: function ()
		{
			var me = this,
				resultContainer = me.getWindow(),
				containerItems,
				store;

			containerItems = resultContainer.getContainerItems();
			store = containerItems.store;

			return store;
		},

		/**
		 * Прерывает предыдущий поиск.
		 */
		abortSearch: function ()
		{
			var me = this,
				win = me.getWindow(),
				plugin;

			if (win)
			{
				win.abort();

				// скрываем индикатор загрузки
				plugin = me.getPlugin('searchField');
				plugin.hideLoader();
			}

		},

		/**
		 * Проверяет нажатие Enter.
		 * @param {Ext.form.Field} field Поле.
		 * @param {Object} e Объект события.
		 */
		checkEnterKey: function (field, e)
		{
			var me = this,
				win = me.getWindow();

			if (e.getKey() === e.ENTER)
			{
				// закрываем окно
				win.close();
			}
		},

		/**
		 * Показывает список данных, сохраненных локально.
		 */
		expandStorage: function ()
		{
			var me = this,
				data = me.getDataStorage(),
				store = me.getStore(),
				win = me.getWindow();

			if (data.length)
			{
				win.clean();
				store.loadData(data);
				win.show();
			}
		},

		/**
		 * Сохраняет данные в localStorage.
		 * @param {Object} data Данные.
		 */
		saveToStorage: function (data)
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				storageData = me.getDataStorage(),
				saveData = [],
				strValue;

			storageData.splice(0, 0, data);

			// обрезаем список, если количество превышает лимит
			if (storageData.length > me.localStorageLimit)
			{
				storageData.splice(me.localStorageLimit, storageData.length - me.localStorageLimit);
			}

			// удаляем дубликаты добавляемой записи
			Ext.Array.each(
				storageData,
				function (item, index)
				{
					if (item.id !== data.id || index == 0)
					{
						saveData.push(item);
					}
				}
			);

			strValue = Ext.JSON.encode(saveData);
			storage.setItem(me.name, strValue);
		},

		/**
		 * Возвращает данные из localStorage.
		 * @return {Array}
		 */
		getDataStorage: function ()
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				data;

			data = Ext.JSON.decode(storage.getItem(me.name));
			data = data ? data : [];

			return data;
		},

		/**
		 * @private
		 * Вызывается после загрузки данных.
		 * @param {Array} data Данные.
		 */
		afterLoad: function (data)
		{
			var me = this,
				win = me.getWindow(),
				plugin;

			plugin = me.getPlugin('searchField');

			if (data)
			{
				// скрываем индикатор
				plugin.hideLoader();

				win.show();
			}
			else
			{
				// меняем индикатор
				plugin.emptyLoader();

				win.close();
			}
		}
	}
);