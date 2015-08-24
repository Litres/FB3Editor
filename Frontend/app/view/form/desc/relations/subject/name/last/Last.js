/**
 * Фамилия персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.last.Last',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.relations.subject.name.last.LastStore',
			'FBEditor.view.form.desc.relations.subject.name.last.LastController'
		],
		controller: 'form.desc.relations.subject.name.last',
		xtype: 'form-desc-relations-subject-name-last',
		queryMode: 'remote',
		queryParam: 'last',
		minChars: 3,
		displayField: 'last_name',
		valueField: 'last_name',
		hideTrigger: true,
		listConfig: {
			maxHeight: 'auto'
		},
		listeners: {
			select: 'onSelect',
			focus: 'onFocus'
		},

		/**
		 * @property {Ext.util.LocalStorage} Локальное хранилище.
		 */
		localStorage: null,

		/**
		 * @property {Number} Максимальное количество записей хранящихся в локальном хранилище.
		 */
		localStorageLimit: 10,

		initComponent: function ()
		{
			var me = this,
				store,
				storage;

			me.tpl = Ext.create(
				'Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item boundlist-person">',
                '<div class="last-name">{last_name}</div>',
				'<div class="first-name">{first_name} {middle_name}</div>',
				/*'<div class="uuid">{uuid}</div>',*/
                '</div>',
                '</tpl>'
			);

			store = Ext.create('FBEditor.view.form.desc.relations.subject.name.last.LastStore');
			me.store = store;

			storage = Ext.util.LocalStorage.get('FBEditor');
			me.localStorage = storage || new Ext.util.LocalStorage(
				{
					id: 'FBEditor'
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