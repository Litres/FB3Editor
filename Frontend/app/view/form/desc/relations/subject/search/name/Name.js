/**
 * Поисковое поле по фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.Name',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.NameController',
		    'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainer'
		],
		controller: 'form.desc.relations.subject.search.name',
		xtype: 'form-desc-relations-subject-searchName',
		checkChangeBuffer: 200,
		plugins: {
			ptype: 'searchField',
			style: 'margin-left: 280px'
		},

		keyEnterAsTab: true,

		listeners: {
			select: 'onSelect',
			afterrender: 'onAfterRender',
			click: {
				element: 'el',
				fn: 'onClick'
			},
			change: 'onChange'
		},

		/**
		 * @property {Number} Максимальное количество записей хранящихся в локальном хранилище.
		 */
		localStorageLimit: 10,

		/**
		 * @private {FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainer}
		 * Контейнер для отображения результатов поиска.
		 */
		resultContainer: null,

		initComponent: function ()
		{
			var me = this,
				resultContainer;

			resultContainer = Ext.create(
				{
					xtype: 'form-desc-relations-subject-searchName-resultContainer',
					alignTarget: me.getId()
				}
			);

			// устанваливаем связь контейнера с полем
			resultContainer.inputField = me;

			me.resultContainer = resultContainer;

			me.callParent(arguments);
		},

		/**
		 * Проверяет нажатие Enter.
		 * @param {Ext.Component} field Поле.
		 * @param {Object} e Объект события.
		 */
		checkEnterKey: function (field, e)
		{
			var me = this;

			if (e.getKey() === e.ENTER)
			{
				// закрываем окно результатов
				me.getResultContainer().close();
			}
		},

		/**
		 * Возвращает контейнер для отображения результатов поиска.
		 * @return {FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainer}
		 */
		getResultContainer: function ()
		{
			return this.resultContainer;
		},

		/**
		 * Показывает список персон, сохраненных локально.
		 */
		expandStorage: function ()
		{
			var me = this,
				data = me.getDataStorage(),
				store = me.getStore(),
				resultContainer = me.getResultContainer();

			//console.log('expand storage', data);
			if (data.length)
			{
				resultContainer.clean();
				store.loadData(data);
				resultContainer.show();
			}
		},

		/**
		 * Сохраняет данные персоны в localStorage.
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
		 * Возвращает данные персон из localStorage.
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
		 * Возвращает хранилище данных.
		 * @return {FBEditor.view.panel.persons.PersonsStore}
		 */
		getStore: function ()
		{
			var me = this,
				resultContainer = me.getResultContainer(),
				panelPersons,
				store;

			panelPersons = resultContainer.getPanelPersons();
			store = panelPersons.store;

			return store;
		},

		/**
		 * @private
		 * Вызывается после загрузки данных.
		 * @param {Array} data Данные.
		 */
		afterLoad: function (data)
		{
			var me = this,
				resultContainer = me.getResultContainer(),
				plugin;

			plugin = me.getPlugin('searchField');

			if (data)
			{
				// скрываем индикатор
				plugin.hideLoader();
			}
			else
			{
				// меняем индикатор
				plugin.emptyLoader();

				resultContainer.close();
			}
		}
	}
);