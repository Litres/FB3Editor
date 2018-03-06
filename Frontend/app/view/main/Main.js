/**
 * Главный контейнер приложения.
 * Подключается в app.js через свойство "autoCreateViewport".
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.main.Main',
	{
	    extend: 'Ext.container.Container',
	    requires: [
	        'FBEditor.view.main.MainController',
		    'FBEditor.view.panel.main.tools.Tools',
	        'FBEditor.view.panel.main.navigation.Navigation',
		    'FBEditor.view.panel.main.content.Content',
	        'FBEditor.view.panel.main.props.Props'
	    ],

		id: 'main',
	    xtype: 'main',
	    controller: 'main',

        cls: 'fb3',

        listeners: {
            resize: 'onResize',
            drop: 'onDrop',
            dragover: 'onDragover',
            focusDetachPanels: 'onFocusDetachPanels',
            checkWidthPanels: 'onCheckWidthPanels',
            closedetachpanels: 'onDetachPanel',
            closeapplication: 'onCloseApplication',
            restoredetachpanel: 'onRestoreDetachPanel',
            accessHub: 'onAccessHub'
        },

	    layout: {
	        type: 'border'
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
			}
			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this;

			if (!FBEditor.parentWindow)
			{
				// добавляем панели
				Ext.Object.each(
					me.windowPanels,
					function (key)
					{
						if (!FBEditor.getLocalStorage().getItem(key))
						{
							// добавляем панели в главное окно
							me.add(me.panelConfig[key]);
						}
						else
						{
							// открываем отсоединенные панели
							me.fireEvent('restoredetachpanel', key);
						}
					}
				);

				// добавляем события Drag&Drop
                me.getEl().on(
                    {
                        drop: function (e)
                        {
                            this.fireEvent('drop', e.event, this);
                        },
                        dragover: function (e)
                        {
                            this.fireEvent('dragover', e.event, this);
                        },
                        scope: me
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
				bridgeWindow = FBEditor.getBridgeWindow(),
				app = FBEditor.getApplication(),
				title,
                desc,
                bookName,
                xtype,
				panel;

			xtype = 'panel-main-' + name;

			panel = me.add(
				{
					xtype: xtype,
					region: 'center'
				}
			);

            desc = bridgeWindow.Ext.getCmp('form-desc');
            bookName = desc.getBookName();
            title = panel.title + ' | ' + bookName;
			app.setTitle(title);
		},

		/**
		 * Присоеденияет отсоединенную панель обратно.
		 * @param {String} name Имя панели.
		 * @param {Window} [win] Окно отсоединенной панели.
		 */
		attachPanel: function (name, win)
		{
			var me = this,
				id;

			id = 'panel-main-' + name;

			if (!me.contains(Ext.getCmp(id)))
			{
				FBEditor.childWindow[name] = null;
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
