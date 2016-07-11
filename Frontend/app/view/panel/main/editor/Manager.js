/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',

		/**
		 * @property {String} Адрес загрузки/сохранения тела.
		 */
		url: 'https://hub.litres.ru/pages/update_hub_on_fb3_body/',

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

		constructor: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				params;

			me.callParent(arguments);

			// инициализиурем адрес загрузки тела книги с хаба, если требуется

			params = routeManager.getParams();

			if (params.body_art)
			{
				me.loadUrl = me.url + '?art=' + params.body_art;
			}
			else if (params.body)
			{
				// запоминаем url загрузки описания
				me.loadUrl = params.body;
			}
			else if (params.body === null)
			{
				// признак первоначальной загрузки редактора тела книги
				me.loadUrl = 'undefined';
			}

			me.saveUrl = me.url;
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
				url = me.loadUrl,
				res;

			res = url && url !== 'undefined' ? true : false;

			return res;

		},

		/**
		 * Загружает тело из url.
		 */
		loadFromUrl: function ()
		{
			var me = this,
				url = me.loadUrl;

			// загружена ли пустая панель
			if (!Ext.getCmp('panel-empty') || !Ext.getCmp('panel-empty').rendered)
			{
				Ext.defer(
					function ()
					{
						me.loadFromUrl();
					},
					500
				);
				
				return;
			}

			Ext.log({level: 'info', msg: 'Загрузка тела из ' + url});

			Ext.Ajax.request(
				{
					url: url,
					success: function(response)
					{
						var xml,
							msg;

						try
						{
							if (response && response.responseText && /^<\?xml/ig.test(response.responseText))
							{
								xml = response.responseText;
								me.loadDataToEditor(xml);
							}
							else
							{
								throw Error();
							}
						}
						catch (e)
						{
							msg = ' (' + e + ')';
							Ext.log({level: 'error', msg: 'Ошибка загрузки тела книги',
								        dump: {response: response, error: e}});
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить тело книги по адресу ' + url + msg,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
						}
					},
					failure: function (response)
					{
						var xml,
							msg;

						try
						{
							if (response && response.responseText && /^<\?xml/ig.test(response.responseText))
							{
								xml = response.responseText;
								me.loadDataToEditor(xml);
							}
							else
							{
								throw Error();
							}
						}
						catch (e)
						{
							msg = ' (' + e + ')';
							Ext.log({level: 'error', msg: 'Ошибка загрузки тела книги',
								        dump: {response: response, error: e}});
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить тело книги по адресу ' + url + msg,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
						}
					}
				}
			);
		},

		/**
		 * @private
		 * Загружает данные в редактор тела.
		 * @param {String} xml Данные тела в виде строки xml.
		 */
		loadDataToEditor: function (xml)
		{
			var me = this,
				editor = me.getEditor(),
				content = Ext.getCmp('panel-main-content'),
				delay;

			try
			{
				if (content.isActiveItem('main-editor'))
				{
					// переключаемся на пустую панель
					me.needShowForm = true;
					content.fireEvent('contentEmpty');
				}
			}
			catch (e)
			{
				if (me.needShowForm)
				{
					// переключаемся на описание для инициализации необходимых компонентов
					content.fireEvent('contentDesc');

					// переключаемся на текст
					me.needShowForm = false;
					content.fireEvent('contentBody');
				}

				throw e;
			}

			// задержка
			delay = me.isLoadUrl() ? 100 : 0;

			Ext.defer(
				function ()
				{
					// указываем, что данные вводятся не пользователям, а во время загрузки
					me.loadingProcess = true;

					// создаем контент из xml-строки
					me.createContent(xml);

					me.loadingProcess = false;

					if (me.needShowForm)
					{
						// переключаемся на описание для инициализации необходимых компонентов
						content.fireEvent('contentDesc');

						// переключаемся на текст
						me.needShowForm = false;
						content.fireEvent('contentBody');
					}
				},
				delay
			);
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
		}
	}
);