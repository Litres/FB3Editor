/**
 * Поле поиска с выпадающим списком и сохранением последних выбранных записей.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.combosearch.ComboSearch',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.field.combosearch.ComboSearchController'
		],
		controller: 'combosearch',
		xtype: 'combosearch',

		autoSelect: false,
		queryMode: 'remote',
		minChars: 2,
		hideTrigger: true,
		queryDelay: 200,
		listeners: {
			select: 'onSelect',
			focus: 'onFocus'
		},

		/**
		 * @property {Number} Задержка запроса после 3 символа.
		 */
		queryDelayFast: 200,

		/**
		 * @property {Number} Задержка запроса после 2 символа.
		 */
		queryDelaySlow: 1000,

		/**
		 * @property {Ext.util.LocalStorage} Локальное хранилище.
		 */
		localStorage: null,

		/**
		 * @property {Number} Максимальное количество записей хранящихся в локальном хранилище.
		 */
		localStorageLimit: 10,

		/**
		 * @template
		 * Возвращает созданное хранилище.
		 * @return {Ext.data.Store} Хранилище.
		 */
		getCreateStore: function ()
		{
			// необходима конкретная реализация
			throw Error('Необходимо реализовать метод view.field.combosearch.ComboSearch#getCreateStore()');
		},

		initComponent: function ()
		{
			var me = this,
				storage;

			me.store = me.getCreateStore();

			storage = Ext.util.LocalStorage.get('FBEditor');
			me.localStorage = storage || new Ext.util.LocalStorage(
					{
						id: 'FBEditor'
					}
				);

			me.callParent(arguments);
		},

		onPaste: function ()
		{
			var me = this,
				val = me.getValue();

			if (!me.isValid())
			{
				me.collapse();
				return;
			}

			// определяем задержку запроса, в зависимости от количества введенных символов
			me.queryDelay = val && val.length > me.minChars ? me.queryDelayFast : me.queryDelaySlow;

			me.callParent(arguments);
		},

		onKeyUp: function (e)
		{
			var me = this,
				k = e.getKey(),
				val = me.getValue(),
				pos;

			if (!me.isValid())
			{
				me.collapse();
				return;
			}

			// позиция курсора в поле
			pos = me.inputEl.dom.selectionStart;

			// запрос не отправится, если введен пробел в конце строки
			if (k !== e.SPACE || k === e.SPACE && pos !== val.length)
			{
				// определяем задержку запроса, в зависимости от количества введенных символов
				me.queryDelay = val && val.length > me.minChars ? me.queryDelayFast : me.queryDelaySlow;

				//me.setValue(val.trim());

				me.callParent(arguments);
			}

		},

		/**
		 * Показывает список персон, сохраненных локально.
		 */
		expandStorage: function ()
		{
			var me = this,
				data = me.getDataStorage(),
				store = me.getStore();

			//console.log('expand storage', data);
			if (data.length)
			{
				store.loadData(data);
				me.expand();
			}
		},

		/**
		 * Сохраняет данные персоны в localStorage.
		 * @param {Object} data Данные.
		 */
		saveToStorage: function (data)
		{
			var me = this,
				storage = me.localStorage,
				storageData = me.getDataStorage(),
				strValue;

			storageData.push(data);

			if (storageData.length > me.localStorageLimit)
			{
				storageData.shift();
			}

			strValue = Ext.JSON.encode(storageData);
			storage.setItem(me.name, strValue);
		},

		/**
		 * Возвращает данные персон из localStorage.
		 * @return {Array}
		 */
		getDataStorage: function ()
		{
			var me = this,
				storage = me.localStorage,
				data;

			data = Ext.JSON.decode(storage.getItem(me.name));

			return data || [];
		}
	}
);