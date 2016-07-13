/**
 * Контроллер главного контейнера.
 */

Ext.define(
	'FBEditor.view.main.MainController',
	{
	    extend: 'Ext.app.ViewController',
	    alias: 'controller.main',
		routes: {
			'panel/:name': {
				before: 'beforeCreatePanel',
				action: 'createPanel',
				conditions: {
					':name' : '(navigation|props)'
				}
			}
		},

	    init: function ()
	    {
	        //
	    },

		/**
		 * Оповещает все необходимые компоненты, что хаб доступен.
		 */
		onAccessHub: function ()
		{
			var cmpArr = [
					Ext.getCmp('form-desc'),
					Ext.getCmp('panel-toolstab-file-button-savebody')
				];

			Ext.Array.each(
				cmpArr,
				function (cmp)
				{
					if (cmp)
					{
						cmp.fireEvent('accessHub');
					}
				}
			);
		},

		/**
		 * Выполняет необходимые проверки перед тем как создать панель.
		 * @param {String} name Имя панели.
		 * @param {Object} action Необходимые колбэки для передачи управления.
		 */
		beforeCreatePanel: function (name, action)
		{
			if (FBEditor.parentWindow)
			{
				action.resume();
			}
		},

		/**
		 * Создает панель.
		 * @param {String} name Имя панели.
		 */
		createPanel: function (name)
		{
			var me = this,
				view;

			view = me.getView();
			view.createPanel(name);
		},

		/**
		 * Вызывается при изменении размеров панели.
		 * @param {FBEditor.view.main.Main} cmp Главная панель.
		 * @param {Number} width
		 * @param {Number} height
		 * @param {Number} oldWidth
		 * @param {Number} oldHeight
		 */
		onResize: function (cmp, width, height, oldWidth, oldHeight)
		{
			var me = this;

			// проверка изменения ширины
			if (width !== oldWidth)
			{
				me.onCheckWidthPanels();
			}
		},

		/**
		 * Вызывается перед закрытием главного окна.
		 */
		onCloseApplication: function ()
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps();

			me.closeDetachPanels();
		},

		/**
		 * Восстанавливает отсоединенную панель.
		 * @param {String} name Имя панели.
		 */
		onRestoreDetachPanel: function (name)
		{
			var me = this,
				box,
				params,
				win;

			box = FBEditor.getLocalStorage().getItem(name);
			box = Ext.Object.fromQueryString(box, true);
			params = 'width=' +box.width +
				',height=' + box.height +
				',top=' + box.top +
				',left=' + box.left +
				',toolbar=no' +
				',location=no';
			win = window.open('#panel/' + name, name, params);
			if (win)
			{
				// сохраняем ссылку на дочернее окно
				FBEditor.childWindow[name] = win;
			}
			else
			{
				// если окно было заблокировано браузером, то показываем панель в главном окне
				me.getView().attachPanel(name);
			}
		},

		/**
		 * Проверяет ширину отсоединяемых панелей, и если они перекрывают центральную панель,
		 * то корректирует их ширину.
		 */
		onCheckWidthPanels: function ()
		{
			var panels = {},
				widthPanels = {};

			panels.content = Ext.getCmp('panel-main-content');

			// если панель не отсоединена, то проверяем ширину панелей, чтобы они не перекрывали центральную часть
			if (panels.content)
			{
				panels.props = Ext.getCmp('panel-main-props');
				panels.nav = Ext.getCmp('panel-main-navigation');

				widthPanels.main = Ext.getCmp('main').getWidth();
				widthPanels.content = panels.content.getMinWidth();
				widthPanels.props = panels.props ? panels.props.getWidth() : 0;
				widthPanels.nav = panels.nav ? panels.nav.getWidth() : 0;

				widthPanels.sum = widthPanels.props + widthPanels.nav + widthPanels.content;
				//console.log('widthPanels', widthPanels);

				// панели перекрывают центральную часть
				if (widthPanels.main - widthPanels.sum < 0)
				{

					// устанавливаем ширину обеих панелей поровну
					if (panels.props)
					{
						panels.props.setWidth((widthPanels.main - widthPanels.content) / 2);
					}
					if (panels.nav)
					{
						panels.nav.setWidth((widthPanels.main - widthPanels.content) / 2);
					}
				}
			}
		},

		/**
		 * Передает фокус отсоединенным панелям, поднимая их наверх.
		 */
		onFocusDetachPanels: function ()
		{
			var me = this,
				view;

			view = me.getView();
			Ext.Object.each(
				view.windowPanels,
				function (key, win)
				{
					if (win)
					{
						win.focus();
						if (!Ext.isIE)
						{
							// для всех браузеров, кроме IE
							win.alert('Панель найдена');
						}
					}
				}
			);
		},

		/**
		 * Закрывает все отсоединеные панели.
		 */
		closeDetachPanels: function ()
		{
			var me = this,
				view,
				box;

			view = me.getView();
			Ext.Object.each(
				view.windowPanels,
				function (key, win)
				{
					if (win)
					{
						// сохраняем состояние отсоединенной панели
						box = {
							width: win.innerWidth,
							height: win.innerHeight,
							left: win.screenX,
							top: win.screenY
						};
						FBEditor.getLocalStorage().setItem(key, Ext.Object.toQueryString(box, true));
						
						win.close();
						FBEditor.childWindow[name] = null;
					}
				}
			);
		}
	}
);
