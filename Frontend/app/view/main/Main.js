/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */

Ext.define(
	'FBEditor.view.main.Main',
	{
	    extend: 'Ext.container.Container',
	    requires: [
	        'FBEditor.view.main.MainController',
	        'FBEditor.view.main.MainModel',
		    'FBEditor.view.panel.main.tools.Tools',
	        'FBEditor.view.panel.main.navigation.Navigation',
		    'FBEditor.view.panel.main.content.Content',
	        'FBEditor.view.panel.main.props.Props'
	    ],
		id: 'main',
	    xtype: 'main',
	    controller: 'main',
	    viewModel: {
	        type: 'main'
	    },
	    layout: {
	        type: 'border'
	    },
		listeners: {
			closedetachpanels: 'onDetachPanel',
			closeapplication: 'onCloseDetachPanels',
			restoredetachpanel: 'onRestoreDetachPanel'
		},

		/**
		 * @property {Object} Конфигурация панелей по умолчанию.
		 */
		panelConfig: {
			navigation: {
				xtype: 'panel-main-navigation',
				width: '15%',
				region: 'west',
				detachable: true,
				collapsible: true
			},
			props: {
				xtype: 'panel-main-props',
				width: '15%',
				region: 'east',
				detachable: true,
				collapsible: true
			}
		},

		/**
		 * @property {Object} Ссылки на окна с отсоединенными панелями.
		 */
		windowPanels: {
			navigation: null,
			props: null
		},

		initComponent: function ()
		{
			var me = this;

			if (!FBEditor.parentWindow)
			{
				me.items = [
					{
						xtype: 'panel-main-tools'
					},
					{
						xtype: 'panel-main-content'
					}
				];

				// добавляем панели
				Ext.Object.each(
					me.windowPanels,
					function (key)
					{
						if (!localStorage.getItem(key))
						{
							// добавляем панели в главное окно редактора
							me.items.push(me.panelConfig[key]);
						}
						else
						{
							// открываем отсоединенные панели
							me.fireEvent('restoredetachpanel', key);
						}
					}
				);
			}

			me.callParent(arguments);
		},

		/**
		 * Создает панель в отдельном окне.
		 * @param {String} name Имя панели.
		 */
		createPanel: function (name)
		{
			var me = this,
				xtype,
				panel;

			xtype = 'panel-main-' + name;
			panel = me.add(
				{
					xtype: xtype,
					region: 'center'
				}
			);
			document.title = document.title + ' - ' + panel.title;
		},

		/**
		 * Присоеденияет отсоединенную панель обратно.
		 * @param {String} name Имя панели.
		 */
		attachPanel: function (name)
		{
			var me = this,
				id;

			id = 'panel-main-' + name;
			if (!me.contains(Ext.getCmp(id)))
			{
				me.add(me.panelConfig[name]);
				me.windowPanels[name] = null;
			}
		},

		/**
		 * Убирает отсоединенную панель из  главного окна.
		 * @param {Window} win Ссылка на окно с отсоединенной панелью.
		 */
		removeDetachedPanel: function (win)
		{
			var me = this,
				name,
				id;

			name = win.name;
			me.windowPanels[name] = win;
			id = 'panel-main-' + name;
			if (me.contains(Ext.getCmp(id)))
			{
				Ext.getCmp(id).close();
			}
		}
	}
);
