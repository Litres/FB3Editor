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

		enableKeyEvents: true,
		autoSelect: false,
		queryMode: 'remote',
		minChars: 2,
		hideTrigger: true,
		queryDelay: 200,
		defaultListConfig: {
			shadow: false,
			maxHeight: 200
		},

		keyEnterAsTab: true,

		listeners: {
			select: 'onSelect',
			click: 'onClick'
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
		 * @property {Number} Максимальное количество записей хранящихся в локальном хранилище.
		 */
		localStorageLimit: 10,

		translateText: {
			notFound: 'Ничего не найдено'
		},

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
			var me = this;

			me.defaultListConfig.emptyText = me.translateText.notFound;
			me.store = me.getCreateStore();
			me.localStorage = FBEditor.getLocalStorage();

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				input = me.inputEl.dom;

			// позволяем обрабатывать событие клика
			me.getEl().on(
				{
					click: function ()
					{
						me.fireEvent('click');
					},
					scope: me
				}
			);

			// регистрируем события клавиш, которые не должны передаваться в выпадающий список
			input.addEventListener(
				'keydown',
			    function (e)
			    {
				    var event = Ext.event.Event,
					    k = e.keyCode,
					    stopList;

				    stopList = [event.HOME, event.END, event.LEFT, event.RIGHT];

				    if (Ext.Array.contains(stopList, k))
				    {
					    e.stopPropagation();
				    }
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
				store.setAutoSort(false);
				store.loadData(data);
				me.expand();
				store.setAutoSort(true);
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
				strValue;

			storageData.splice(0, 0, data);

			if (storageData.length > me.localStorageLimit)
			{
				storageData.pop();
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
				storage = FBEditor.getLocalStorage(),
				data;

			data = Ext.JSON.decode(storage.getItem(me.name));
			data = data ? data : [];

			return data;
		}
	}
);