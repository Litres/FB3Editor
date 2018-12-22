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

		listeners: {
			select: 'onSelect',
			click: 'onClick'
		},

		plugins: [
			{
				ptype: 'fieldCleaner'
			},
			{
				ptype: 'searchField',
				style: 'margin-left: 258px'
			}
		],

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

		/**
		 * Показывает список персон, сохраненных локально.
		 */
		expandStorage: function ()
		{
			var me = this,
				data = me.getDataStorage(),
				store = me.getStore();

			if (data.length)
			{
				store.setSortOnLoad(false);
				store.loadData(data);
				me.expand();
				store.setSortOnLoad(true);
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
		 * @private
		 * Переписываем стандартный метод, чтобы скрыть список и стандартный индикатор загрузки в списке.
		 * @param queryPlan
		 */
		doRemoteQuery: function(queryPlan)
		{
			var me = this,
				loadCallback = function() {
					me.afterQuery(queryPlan);
				},
				plugin;

			// показываем индикатор поиска
			plugin = me.getPlugin('searchField');
			plugin.showLoader();

			// fix
			//me.expand();
			me.collapse();

			// In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
			// and these are automatically passed as params with every load call, so we do *not* call clearFilter.
			if (me.pageSize) {
				// if we're paging, we've changed the query so start at page 1.
				me.loadPage(1, {
					rawQuery: queryPlan.rawQuery,
					callback: loadCallback
				});
			} else {
				me.store.load({
					params: me.getParams(queryPlan.query),
					rawQuery: queryPlan.rawQuery,
					callback: loadCallback
				});
			}
		},

		/**
		 * @private
		 * Переписываем стандартный метод, чтобы показать список и спрятать индикатор.
		 * @param queryPlan
		 */
		afterQuery: function(queryPlan)
		{
			var me = this,
				data,
				plugin;

			data = me.store.getData().items.length ? me.store.getData().items : null;
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
			}

			// fix
			me.expand();

			me.callParent(arguments);
		}
	}
);