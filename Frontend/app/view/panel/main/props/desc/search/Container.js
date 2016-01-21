/**
 * Родительский контейнер с результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.Container',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.search.ContainerController'
		],
		mixins: {
			behavior: 'FBEditor.view.container.desc.search.OwnerContainerBehavior'
		},
		controller: 'props.desc.search.container',
		xtype: 'props-desc-search-container',

		hidden: true,

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {String} xtype контейнера с результатми поиска.
		 */
		xtypeContainerItems: '',

		/**
		 * @property {Ext.Container} Панель персон.
		 */
		containerItems: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: me.xtypeContainerItems
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

			names = storage.getItem(me.id);
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

			storage.setItem(me.id, JSON.stringify(names));
		},

		clean: function ()
		{
			this.setVisible(false);
			this.mixins.behavior.clean.call(this);
		},

		abort: function ()
		{
			this.setVisible(false);
			this.mixins.behavior.abort.call(this);
		},

		getContainerItems: function ()
		{
			return this.mixins.behavior.getContainerItems.call(this);
		}
	}
);