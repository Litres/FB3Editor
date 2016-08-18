/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',
		requires: [
			'FBEditor.view.panel.main.editor.Loader'
		],

		/**
		 * @property {String} Адрес загрузки/сохранения тела.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_body/',

		/**
		 * @property {String} Адрес загрузки тела.
		 */
		loadUrl: null,

		/**
		 * @property {String} Адрес сохранения тела.
		 */
		saveUrl: null,

		/**
		 * @property {Boolean} Идет ли в данный момент процесс загрузки данных в форму.
		 */
		loadingProcess: false,

		/**
		 * @property {String} Id корневого элемента fb3-body.
		 */
		fb3BodyId: '',

		/**
		 * @private
		 * @property {Number} Айди произведения на хабе.
		 */
		art: null,

		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this,
				loader = FBEditor.view.panel.main.editor.Loader;

			// загрузчик
			me.loader = loader.getLoader();
		},

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);

			// обновляем дерево навигации по тексту
			me.updateTree();
		},

		setFocusElement: function (elOrNode, sel)
		{
			var me = this,
				panelNav = me.getPanelNavigation(),
				el;

			me.callParent(arguments);

			el = me.getFocusElement();

			// разворачиваем узел элемента в дереве навигации по тексту
			panelNav.expandElement(el);
		},

		getPanelProps: function ()
		{
			var bridge = FBEditor.getBridgeProps(),
				panel;

			panel = bridge.Ext.getCmp('panel-props-body');

			return panel;
		},

		/**
		 * Обновляет дерево навигации по тексту.
		 */
		updateTree: function ()
		{
			var me = this,
				panel = me.getPanelNavigation();

			if (panel)
			{
				panel.loadData(me.content);
			}
			else
			{
				Ext.defer(
					function ()
					{
						me.updateTree();
					},
					200
				);
			}
		},

		/**
		 * Загружается ли тело отдельно по url.
		 * @return {Boolean}
		 */
		isLoadUrl: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.isLoad();
		},

		/**
		 * Загружает тело из url.
		 * @param {Number} [art] Айди произведениея на хабе.
		 */
		loadFromUrl: function (art)
		{
			var me = this,
				loader = me.loader;

			me.setLoading(art).then(
				function (art)
				{
					// загружаем тело с хаба

					art = art || me.getArtId();

					return loader.load(art);
				}
			).then(
				function (xml)
				{
					var resourceManager = FBEditor.resource.Manager;

					// загружены ли уже ресурсы
					if (!resourceManager.isLoadUrl())
					{
						// загружаем ресурсы с хаба
						resourceManager.loadFromUrl(me.getArtId());
					}

					// загружаем данные в редактор
					me.loadDataToEditor(xml);
				},
				function (response)
				{
					// возникла ошибка

					Ext.log(
						{
							level: 'error',
							msg: 'Ошибка загрузки тела книги',
							dump: response
						}
					);

					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно загрузить тело книги',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);

					// убираем информационное сообщение о загрузке
					me.clearLoading();
				}
			);
		},

		/**
		 * Возвращает айди произведения, загружаемого с хаба.
		 * @return {String}
		 */
		getArtId: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.getArt();
		},

		/**
		 * @private
		 * Загружает данные в редактор тела.
		 * @param {String} xml Данные тела в виде строки xml.
		 */
		loadDataToEditor: function (xml)
		{
			var me = this,
				content = Ext.getCmp('panel-main-content');

			me.createContent(xml);
			content.fireEvent('contentBody');
		},

		/**
		 * @private
		 * Возвращает дерево навигации.
		 * @return {FBEditor.view.panel.treenavigation.body.Tree}
		 */
		getPanelNavigation: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeNavigation(),
				panel;

			panel = bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation') ?
			        bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation') : null;

			return panel;
		},

		/**
		 * @private
		 * Устанавливает сообщение о загрузке.
		 * @param {Number} [art] Айди произведениея на хабе.
		 * @return {Promise}
		 */
		setLoading: function (art)
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					var emptyPanel = Ext.getCmp('panel-empty'),
						contentPanel = Ext.getCmp('panel-main-content');

					//console.log('emptyPanel', !emptyPanel || !emptyPanel.rendered);

					// ожидаем пока не будет отрисована пустая панель
					if (!emptyPanel || !emptyPanel.rendered)
					{
						Ext.defer(
							function ()
							{
								resolve(me.setLoading(art));
							},
							500
						);
					}

					// показываем пустую панель
					contentPanel.fireEvent('contentEmpty');

					// устанавливаем сообщение
					emptyPanel.setMessage('Загрузка текста...');

					resolve(art);
				}
			);

			return promise;
		},

		/**
		 * @private
		 * Убирает информационное сообщение о загрузке.
		 */
		clearLoading: function ()
		{
			var contentPanel = Ext.getCmp('panel-main-content');

			// показываем панель описания
			contentPanel.fireEvent('contentBody');
		}
	}
);