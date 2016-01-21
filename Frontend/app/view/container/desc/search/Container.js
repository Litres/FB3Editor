/**
 * Контейнер с результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.Container',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.container.desc.search.ContainerController',
			'FBEditor.view.container.desc.search.OwnerContainerBehavior'
		],
		controller: 'container.desc.search',
		xtype: 'container-desc-search',
		minWidth: 300,

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {Function} Вызывается при выборе записи из списка.
		 * @param {Object} Данные записи.
		 */
		selectFn: Ext.emptyFn,

		/**
		 * @property {Ext.Element} Индикатор поиска.
		 */
		maskEl: null,

		translateText: {
			searching: 'Поиск...',
			notFound: 'Ничего не найдено'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = me.createStore();
			me.store = store;
			store.setCallback(
				{
					fn: me.load,
					scope: me
				}
			);

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				maskEl;

			me.callParent(arguments);

			// индикатор поиска
			maskEl = me.getEl().createChild(
				{
					tag: 'div',
					html: me.translateText.searching,
					class: 'mask-container-desc-search',
					//style: 'display: none',
					children: [
						{
							tag: 'i',
							class: 'fa fa-spinner fa-pulse fa-3x'
						}
					]
				}
			);
			me.maskEl = maskEl;
			me.maskSearching(false);
		},

		/**
		 * @abstract
		 * Создает и возвращает хранилище.
		 */
		createStore: function ()
		{
			throw Error('Необходимо определить метод FBEditor.view.container.desc.search.Container#createStore()');
		},

		/**
		 * @abstract
		 * Загружает данные в контейнер.
		 * @event afterLoad Вбрасывается после загрузки данных.
		 * @param {Array} data Данные.
		 */
		load: function (data)
		{
			throw Error('Необходимо определить метод FBEditor.view.container.desc.search.Container#load()');
		},

		/**
		 * Показывает или скрывает индикатор поиска.
		 * @param {Boolean} show true - показать ли индикатор.
		 */
		maskSearching: function (show)
		{
			var me = this,
				maskEl = me.maskEl;

			if (maskEl)
			{
				maskEl.setVisible(show);
			}
		},

		/**
		 * Удаляет все данные из контейнера.
		 */
		clean: function ()
		{
			var me = this;

			Ext.suspendLayouts();
			me.removeAll();
			Ext.resumeLayouts();
			me.doLayout();
		},

		/**
		 * Прерывает поиск.
		 * @event abort Вбрасывается после прерывания запроса.
		 */
		abort: function ()
		{
			var me = this,
				store = me.store;

			me.maskSearching(false);
			store.abort();
			me.fireEvent('abort');
		},

		/**
		 * Выводит сообщение о том, что ничего не найдено.
		 */
		notFound: function ()
		{
			var me = this;

			me.clean();

			me.add(
				{
					border: true,
					layout: 'fit',
					style: 'text-align: center',
					html: me.translateText.notFound
				}
			);
		}
	}
);