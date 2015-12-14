/**
 * Контейнер с результатами поиска произведений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.arts.Arts',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.arts.ArtsController',
			'FBEditor.view.panel.arts.Arts'
		],
		controller: 'props.desc.arts',
		xtype: 'props-desc-arts',
		id: 'props-desc-arts',

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {FBEditor.view.panel.arts.Arts} Панель названий произведений.
		 */
		panelArts: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-arts'
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
		 * Возвращает названия из локального хранилища.
		 * @return {Object}
		 */
		getStorageNames: function ()
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				names;

			names = storage.getItem(me.id + '-names');
			names = JSON.parse(names);

			return names;
		},

		/**
		 * Сохраняет названия в локальном хранилище.
		 * @param {Object} names
		 */
		setStorageNames: function (names)
		{
			var me = this,
				storage = FBEditor.getLocalStorage();

			storage.setItem(me.id + '-names', JSON.stringify(names));
		},

		/**
		 * Удаляет все данные из контейнера.
		 */
		clean: function ()
		{
			var me = this,
				panel;

			panel = me.getPanelArts();
			panel.clean();
		},

		/**
		 * Возвращает панель произведений.
		 * @return {FBEditor.view.panel.arts.Arts}
		 */
		getPanelArts: function ()
		{
			var me = this,
				panel;

			panel = me.panelArts || me.down('panel-arts');

			return panel;
		}
	}
);