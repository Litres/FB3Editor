/**
 * Контейнер с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.persons.Persons',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.persons.PersonsController',
			'FBEditor.view.panel.persons.Persons'
		],
		controller: 'props.desc.persons',
		xtype: 'props-desc-persons',
		id: 'props-desc-persons',

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {FBEditor.view.panel.persons.Persons} Панель персон.
		 */
		panelPersons: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-persons'
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				names = me.getStorageNames();

			if (names)
			{
				me.fireEvent('loadData', names);
			}

			me.callParent(arguments);
		},

		/**
		 * Возвращает ФИО из локального хранилища.
		 * @return {Object}
		 */
		getStorageNames: function ()
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				names;

			names = storage.getItem(me.id + '-lastNames');
			names = JSON.parse(names);

			return names;
		},

		/**
		 * Сохраняет ФИО в локальном хранилище.
		 * @param {Object} names
		 */
		setStorageNames: function (names)
		{
			var me = this,
				storage = FBEditor.getLocalStorage();

			storage.setItem(me.id + '-lastNames', JSON.stringify(names));
		},

		/**
		 * Удаляет все данные из контейнера.
		 */
		clean: function ()
		{
			var me = this,
				panel;

			panel = me.getPanelPersons();
			panel.clean();
		},

		/**
		 * Прерывает поиск.
		 */
		abort: function ()
		{
			var me = this,
				panel;

			panel = me.getPanelPersons();
			panel.abort();
		},

		/**
		 * Возвращает панель персон.
		 * @return {FBEditor.view.panel.persons.Persons}
		 */
		getPanelPersons: function ()
		{
			var me = this,
				panel;

			panel = me.panelPersons || me.down('panel-persons');

			return panel;
		}
	}
);