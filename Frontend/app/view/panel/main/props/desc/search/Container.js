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

		/**
		 * @private
		 * @property {Object} Кэш зарегистрированных событий для связанных компонентов.
		 */
		_cacheEvents: {},

		/**
		 * @private
		 * @property {Ext.Component} Компонент поля ввода, связанный с данным контейнером.
		 */
		//_referenceCmp: null,

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
				bridge = FBEditor.getBridgeWindow(),
				descManager = bridge.FBEditor.desc.Manager,
				names = me.getStorageNames();

			if (names)
			{
				me.fireEvent('loadData', names);
			}

			// надо ли очищать результаты в локальном хранилище
			if (!descManager.cleanResultContainer[me.getXType()])
			{
				me.cleanContainer();
			}

			// при новом рендеринге окна свойств, результаты не должны очищаться
			descManager.cleanResultContainer[me.getXType()] = true;

			me.callParent(arguments);
		},

		/**
		 * Возвращает компонент поля ввода, связанный с данным контейнером.
		 * @return {Ext.Component}
		 */
		getReferenceCmp: function ()
		{
			var cmp = this._referenceCmp;

			if (!cmp)
			{
				throw Error('Необходимо определить связанный компонент методом #setReferenceCmp()');
			}

			return cmp;
		},

		/**
		 * Устанавливает компонент поля ввода, связанный с данным контейнером.
		 * @param {Ext.Component} cmp
		 */
		setReferenceCmp: function (cmp)
		{
			var me = this;

			me._referenceCmp = cmp;

			// регистрируем событие загрузки данных в контейнер
			me.registerEventAfterLoad();
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

		/**
		 * Сбрасывает названия, сохраненные в локальном хранилище.
		 */
		cleanContainer: function ()
		{
			var me = this;

			me.clean();
			me.setStorageNames(null);
		},

		/**
		 * Возвращает панель свойств редактора текста.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelProps: function ()
		{
			var me = this,
				panelProps;

			panelProps = me.panelProps || Ext.getCmp('panel-props-desc');
			me.panelProps = panelProps;

			return panelProps
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
		},

		/**
		 * @private
		 * Регистрирует событие загрузки данных в контейнер для связанного поля ввода.
		 */
		registerEventAfterLoad: function ()
		{
			var me = this,
				containerItems = me.getContainerItems(),
				refCmp = me.getReferenceCmp(),
				refId = refCmp.getId(),
				cacheEvent;

			cacheEvent = me._cacheEvents[refId];

			if (!cacheEvent)
			{
				me._cacheEvents[refId] = true;

				containerItems.on(
					{
						scope: refCmp,
						afterLoad: refCmp.afterLoad
					}
				);
			}
		}
	}
);